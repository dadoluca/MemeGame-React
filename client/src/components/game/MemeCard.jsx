import React from 'react';
import { Image, Card, Container, Row, Col } from 'react-bootstrap';
import styles from './MemeCard.module.css';
import Caption from './Caption';

const MemeCard = ({ imageUrl, captions, onCaptionClick }) => {
    return (
        <Container className={styles.container}>
            <Row className="justify-content-md-center">
                <Col md="9">
                    <Card className={styles.card}>
                        <Card.Body className={styles.cardBody}>
                            {imageUrl && (
                                <Image
                                    src={imageUrl}
                                    alt="Random Meme"
                                    fluid
                                    className={styles.image}
                                />
                            )}
                            <div className={styles.captions}>
                                {captions.map((caption, index) => (
                                    <Caption
                                        key={index}
                                        caption={caption}
                                        onClick={() => onCaptionClick(caption)}
                                    />
                                ))}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default MemeCard;
