import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import * as constants from "../constants.js"


const styles = StyleSheet.create({
    page: { padding: 30 },
    title: { fontSize: 20, marginBottom: 20 },
    question: { fontSize: 12, marginBottom: 5, marginTop: 10 },
    scoreHigh: { fontSize: 18, marginBottom: 10, color: 'green' },
    scoreMid: { fontSize: 18, marginBottom: 10, color: 'orange' },
    scoreLow: { fontSize: 18, marginBottom: 10, color: 'red' },
    onePoint: { fontSize: 10, color: 'green', marginBottom: 10 },
    zeroPoint: { fontSize: 10, color: 'red', marginBottom: 10 },
    halfPoint: { fontSize: 10, color: 'orange', marginBottom: 10 },
    label: { fontSize: 10, color: 'black', marginBottom: 10 },
    answer: { fontSize: 10, color: 'gray', marginBottom: 10 },
});

function getScoreColor(ratio) {
    if (ratio <= 0.45) return styles.scoreLow;
    else if (ratio <= 0.65) return styles.scoreMid;
    else return styles.scoreHigh;
}


export default function ExamResultsPDF({ examData }) {
    const score = examData ? Object.values(examData.results).reduce((sum, r) => sum + r.score, 0) : 0;
    const total = examData ? examData.questions.length : 0;
    const scoreColor = getScoreColor(score / total);
    return (
        <Document>
            <Page style={styles.page}>
                <Text style={styles.title}>{examData.title}</Text>
                <Text style={styles.title}>
                    Your score: <Text style={scoreColor}>{score}/{total}</Text>
                </Text>

                {examData.questions.map(q => {
                    var pointsStyle = styles.halfPoint
                    if (examData.results[q.id].score == 1) {
                        pointsStyle = styles.onePoint;
                    } else if (examData.results[q.id].score == 0) {
                        pointsStyle = styles.zeroPoint;
                    }
                    return (
                        <View key={q.id}>
                            <Text style={styles.question}> {q.id}. {q.questionText}</Text>

                            <Text style={styles.label}>
                                Your answer: <Text style={styles.answer}>{examData.studentAnswers[q.id]}</Text>
                            </Text>

                            <Text style={styles.label}>
                                Correct answer: <Text style={styles.answer}>{examData.results[q.id].correctAnswer}</Text>
                            </Text>
                            {q.type == constants.QUESTION_TYPES.SHORT
                                ? <Text style={styles.label}>
                                    AI Feeback: <Text style={styles.answer}>{examData.results[q.id].feedback}</Text>
                                </Text>
                                : ""
                            }

                            <Text style={pointsStyle}>{examData.results[q.id].score} point{examData.results[q.id].score == 1 ? "" : "s"}</Text>
                        </View>
                    )
                })}
            </Page>
        </Document>
    );
}