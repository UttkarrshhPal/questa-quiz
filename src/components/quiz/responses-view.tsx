"use client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Download } from "lucide-react";
import { exportToCSV } from "@/lib/utils";
import { Answer, QuizResponse, ResponsesViewProps } from "@/types";

export function ResponsesView({ quiz, responses }: ResponsesViewProps) {
  const handleExportCSV = () => {
    if (responses.length === 0) return;

    // Format data for CSV export
    const csvData = responses
      .slice() // clone to avoid mutating original
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      .map((response, index) => {
        const row: Record<string, string | number> = {
          "Response #": index + 1,
          "Submitted At": format(
            new Date(response.createdAt),
            "yyyy-MM-dd HH:mm:ss"
          ),
        };

        response.answers.forEach((answer: Answer) => {
          if (answer.question?.text) {
            row[answer.question.text] = answer.value;
          }
        });

        return row;
      });

    exportToCSV(
      csvData,
      `${quiz.title}-responses-${format(new Date(), "yyyy-MM-dd")}`
    );
  };

  // Sort the responses by createdAt (earliest first)
  const sortedResponses = responses
    .slice()
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  if (sortedResponses.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground mb-4">No responses yet</p>
        <p className="text-sm text-muted-foreground">
          Share your quiz link to start collecting responses
        </p>
      </Card>
    );
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={handleExportCSV} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <div className="space-y-4">
        {sortedResponses.map((response: QuizResponse, index: number) => (
          <Card key={response.id} className="p-6">
            <div className="mb-4">
              <h3 className="font-semibold">Response #{index + 1}</h3>
              <p className="text-sm text-muted-foreground">
                Submitted on {format(new Date(response.createdAt), "PPpp")}
              </p>
            </div>
            <div className="space-y-3">
              {response.answers.map((answer: Answer) => (
                <div key={answer.id} className="border-l-2 pl-4">
                  <p className="font-medium text-sm">{answer.question?.text}</p>
                  <p className="mt-1">{answer.value}</p>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
