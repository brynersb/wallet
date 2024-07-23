#!/bin/sh
aws --endpoint-url http://localstack:4566 sqs create-queue --queue-name wallet-transaction-queue --region us-east-1