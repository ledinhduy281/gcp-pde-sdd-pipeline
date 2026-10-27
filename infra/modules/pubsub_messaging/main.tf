resource "google_pubsub_topic" "events_dlq" {
  name   = "${var.name_prefix}-events-dlq-topic"
  labels = merge(var.common_labels, { cost_tier = "serverless" })
}

resource "google_pubsub_subscription" "events_dlq_sub" {
  name                 = "${var.name_prefix}-events-dlq-sub"
  topic                = google_pubsub_topic.events_dlq.id
  ack_deadline_seconds = 60
  labels               = merge(var.common_labels, { cost_tier = "serverless" })
}

resource "google_pubsub_topic" "events" {
  name                       = "${var.name_prefix}-events-topic"
  message_retention_duration = "86400s" # 24 hours replay window
  labels                     = merge(var.common_labels, { cost_tier = "serverless" })
}

resource "google_pubsub_subscription" "events_beam_sub" {
  name                       = "${var.name_prefix}-events-beam-sub"
  topic                      = google_pubsub_topic.events.id
  ack_deadline_seconds       = 60
  retain_acked_messages      = false
  enable_message_ordering    = false
  labels                     = merge(var.common_labels, { cost_tier = "serverless" })

  dead_letter_policy {
    dead_letter_topic     = google_pubsub_topic.events_dlq.id
    max_delivery_attempts = 5
  }

  retry_policy {
    minimum_backoff = "10s"
    maximum_backoff = "600s"
  }
}

resource "google_pubsub_topic_iam_member" "ingest_publisher" {
  topic  = google_pubsub_topic.events.id
  role   = "roles/pubsub.publisher"
  member = "serviceAccount:${var.sa_ingest_email}"
}

resource "google_pubsub_subscription_iam_member" "process_subscriber" {
  subscription = google_pubsub_subscription.events_beam_sub.id
  role         = "roles/pubsub.subscriber"
  member       = "serviceAccount:${var.sa_process_email}"
}
