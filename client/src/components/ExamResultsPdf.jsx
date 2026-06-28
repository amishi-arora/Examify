import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: { padding: 30 },
    title: { fontSize: 20, marginBottom: 20 },
    question: { fontSize: 12, marginBottom: 5 },
    correctAnswer: { fontSize: 10, color: 'green', marginBottom: 10 },
    wrongAnswer: { fontSize: 10, color: 'red', marginBottom: 10 },
    halfPointAnswer: { fontSize: 10, color: 'yellow', marginBottom: 10 },
    label: { fontSize: 10, color: 'gray', marginBottom: 10 }
});

export default function ExamResultsPDF({ examData }) {
    const score = examData ? Object.values(examData.results).reduce((sum, r) => sum + r.score, 0) : 0;
    const total = examData ? examData.questions.length : 0;
    return (
        <Document>
            <Page style={styles.page}>
                <Text style={styles.title}>{examData.title}</Text>
                <Text style={styles.title}>Your score: {score}/{total}</Text>
                {examData.questions.map(q => (
                    <View key={q.id}>
                        <Text style={styles.question}> {q.id}. {q.questionText}</Text>
                        <Text style={styles.label}>
                            <Text style={examData.results[q.id].score == 1 ? styles.correctAnswer :
                                examData.results[q.id].score == 0.5 ? styles.halfPointAnswer : styles.wrongAnswer}>Your answer:</Text>  {examData.studentAnswers[q.id]}</Text>
                        <Text style={styles.label}>
                            <Text style={styles.correctAnswer}>Correct answer:</Text>  {examData.results[q.id].correctAnswer}</Text>
                        <Text style={styles.label}>{examData.results[q.id].score} points</Text>
                    </View>
                ))}
            </Page>
        </Document>
    );
}