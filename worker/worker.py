import pika
import json
import os
import time
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Database setup
DATABASE_URL = os.getenv('DATABASE_URL', 'postgresql://bakery_user:bakery_pass@db:5432/bakery_db')
engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind=engine)

def process_order(order_data):
    session = Session()
    try:
        # Import Order model locally to avoid circular imports
        from app import Order
        order = session.query(Order).get(order_data['order_id'])
        if order:
            # Here you can add any processing logic
            # For now, we'll just set it to 'processing'
            order.status = 'processing'
            session.commit()
            print(f"Order {order.id} status updated to 'processing'")
    except Exception as e:
        print(f"Error processing order: {e}")
        session.rollback()
    finally:
        session.close()

def callback(ch, method, properties, body):
    try:
        order_data = json.loads(body)
        print(f" [x] Received order {order_data['order_id']}")
        process_order(order_data)
        ch.basic_ack(delivery_tag=method.delivery_tag)
    except json.JSONDecodeError:
        print(" [x] Received invalid JSON")
        ch.basic_nack(delivery_tag=method.delivery_tag, requeue=False)
    except Exception as e:
        print(f" [x] Error processing message: {e}")
        ch.basic_nack(delivery_tag=method.delivery_tag, requeue=False)

def main():
    while True:
        connection = None
        try:
            connection = pika.BlockingConnection(
                pika.ConnectionParameters(
                    host=os.getenv('RABBITMQ_HOST', 'rabbitmq'),
                    port=os.getenv('RABBITMQ_PORT', 5672),
                    credentials=pika.PlainCredentials(
                        os.getenv('RABBITMQ_DEFAULT_USER', 'guest'),
                        os.getenv('RABBITMQ_DEFAULT_PASS', 'guest')
                    ),
                    heartbeat=600,
                    blocked_connection_timeout=300
                )
            )
            
            channel = connection.channel()
            channel.queue_declare(queue='order_queue', durable=True)
            channel.basic_qos(prefetch_count=1)
            channel.basic_consume(queue='order_queue', on_message_callback=callback)
            
            print(' [*] Waiting for messages. To exit press CTRL+C')
            channel.start_consuming()
            
        except pika.exceptions.AMQPConnectionError:
            print("Connection to RabbitMQ failed, retrying in 5 seconds...")
            time.sleep(5)
        except KeyboardInterrupt:
            print("Shutting down worker...")
            if connection and connection.is_open:
                connection.close()
            break
        except Exception as e:
            print(f"Unexpected error: {e}")
            if connection and connection.is_open:
                connection.close()
            time.sleep(5)
        finally:
            if connection and connection.is_open:
                connection.close()

if __name__ == '__main__':
    main()