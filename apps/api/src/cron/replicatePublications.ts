import logger from '@hey/helpers/logger';
import lensPg from 'src/db/lensPg';
import createClickhouseClient from 'src/helpers/createClickhouseClient';

const clickhouse = createClickhouseClient();

const getLastBlockNumber = async () => {
  const rows = await clickhouse.query({
    format: 'JSONEachRow',
    query: 'SELECT max(block_number) as max_block_number FROM publications;'
  });

  const result = await rows.json<{ max_block_number: string }>();

  return parseInt(result[0].max_block_number);
};

const replicatePublications = async () => {
  const START_BLOCK_NUMBER = await getLastBlockNumber();
  const END_BLOCK_NUMBER = START_BLOCK_NUMBER + 50000;

  const publications = await lensPg.query(
    `
      SELECT
        pr.publication_id,
        pr.block_timestamp,
        pr.block_number,
        pm.content,
        pm.content_vector
      FROM
        publication.record pr
      JOIN
        publication.metadata pm ON pr.publication_id = pm.publication_id
      WHERE
        pr.block_number >= ${START_BLOCK_NUMBER} AND
        pr.block_number <= ${END_BLOCK_NUMBER} AND
        (pr.publication_type = 'POST' OR pr.publication_type = 'QUOTE')
      ORDER BY
        pr.block_number ASC;
    `
  );

  logger.info(
    `Cron: Inserting ${publications.length} publications - From block ${START_BLOCK_NUMBER} to ${END_BLOCK_NUMBER}`
  );

  // Define a batch size
  const BATCH_SIZE = 1000;
  let batches = [];
  let currentBatch = [];

  for (const row of publications) {
    // Create the data object for each row
    const value = {
      block_number: row.block_number,
      block_timestamp: new Date(row.block_timestamp)
        .toISOString()
        .replace('.000Z', ''),
      content: row.content,
      content_vector: row.content_vector,
      id: row.publication_id
    };

    // Add this object to the current batch
    currentBatch.push(value);

    // Check if the current batch size is reached
    if (currentBatch.length >= BATCH_SIZE) {
      // Push the current batch to batches and reset the current batch
      batches.push(currentBatch);
      currentBatch = [];
    }
  }

  // Add the last batch if it has any records
  if (currentBatch.length > 0) {
    batches.push(currentBatch);
  }

  // Execute all batches concurrently
  const insertPromises = batches.map((batch) => {
    return clickhouse
      .insert({
        format: 'JSONEachRow',
        table: 'publications',
        values: batch
      })
      .then((result) =>
        logger.info(
          `Cron: Inserted batch of ${batch.length} publications, last block: ${batch[batch.length - 1].block_number}, last ID: ${batch[batch.length - 1].id} - ${result.query_id}`
        )
      );
  });

  Promise.all(insertPromises)
    .then(() => {
      logger.info('Cron: All batches have been inserted successfully.');
    })
    .catch((error) => {
      logger.error(`Cron: Error inserting batches: ${error}`);
    });
};

export default replicatePublications;
