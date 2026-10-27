output "events_topic_name" { value = google_pubsub_topic.events.name }
output "dlq_topic_name" { value = google_pubsub_topic.events_dlq.name }
output "events_subscription_name" { value = google_pubsub_subscription.events_beam_sub.name }
