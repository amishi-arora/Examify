import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import * as constants from "../constants.js"

const styles = StyleSheet.create({
    page: { padding: 30 },
    title: { fontSize: 20, marginBottom: 10 },
    mcQuestion: { fontSize: 12, marginBottom: 10, marginTop: 10 },
    shortQuestion: { fontSize: 12, marginBottom: 40, marginTop: 10 },
    mcOption: { fontSize: 10, marginBottom: 10 }
});

export default function BlankExamPdf({ examData }) {
    return (
        <Document>
            <Page style={styles.page}>
                <Text style={styles.title}>{examData.title}</Text>
                {examData.questions.map(q => (
                    <View key={q.id}>
                        <Text style={q.type === constants.QUESTION_TYPES.MC ?
                            styles.mcQuestion : styles.shortQuestion}> {q.id}. {q.questionText}</Text>
                        {
                            q.type === constants.QUESTION_TYPES.MC ?
                                q.options.map(o =>
                                    <Text style={styles.mcOption}> {o}</Text>) :
                                ""
                        }
                    </View>
                ))}
            </Page>
        </Document>
    );
}