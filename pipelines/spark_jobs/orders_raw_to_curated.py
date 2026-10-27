#!/usr/bin/env python3
"""Dataproc Serverless PySpark Batch Job (Spec 05.3).

Reads raw JSON/NDJSON events from GCS Raw bucket, deduplicates by event_id,
derives order_date, and writes Snappy-compressed Hive-partitioned Parquet
to GCS Curated bucket for BigLake External Table querying.
"""

import sys
from pyspark.sql import SparkSession
from pyspark.sql import functions as F
from pyspark.sql.window import Window


def run_spark_curation(raw_gcs_uri: str, curated_gcs_uri: str) -> None:
    spark = (
        SparkSession.builder.appName("pde-orders-raw-to-curated")
        .config("spark.sql.sources.partitionOverwriteMode", "dynamic")
        .getOrCreate()
    )

    raw_df = spark.read.json(raw_gcs_uri)

    # Deduplicate by event_id keeping the latest ingestion/event timestamp
    dedup_window = Window.partitionBy("event_id").orderBy(F.col("event_timestamp").desc())

    curated_df = (
        raw_df.filter(F.col("event_id").isNotNull() & (F.col("order_amount") >= 0))
        .withColumn("rn", F.row_number().over(dedup_window))
        .filter(F.col("rn") == 1)
        .drop("rn")
        .withColumn("event_ts", F.to_timestamp("event_timestamp"))
        .withColumn("order_date", F.to_date("event_ts"))
    )

    (
        curated_df.write.mode("overwrite")
        .partitionBy("order_date")
        .parquet(curated_gcs_uri)
    )

    spark.stop()


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: orders_raw_to_curated.py <raw_gcs_uri> <curated_gcs_uri>")
        sys.exit(1)
    run_spark_curation(sys.argv[1], sys.argv[2])
