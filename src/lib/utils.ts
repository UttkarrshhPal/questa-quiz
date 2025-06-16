// lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateQuizUrl(quizId: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return `${baseUrl}/quiz/${quizId}`;
}

export function exportToCSV(
  data: Record<string, string | number>[],
  filename: string
) {
  if (typeof window === "undefined") return;

  const csvContent = convertToCSV(data);
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up the URL object
  URL.revokeObjectURL(url);
}

function convertToCSV(
  data: Record<string, string | number | null | undefined>[]
): string {
  if (data.length === 0) return "";

  // Get headers from the first object
  const headers = Object.keys(data[0]);
  const csvHeaders = headers.map((header) => `"${header}"`).join(",");

  // Convert each row
  const csvRows = data.map((row) => {
    return headers
      .map((header) => {
        const value = row[header];
        // Handle null/undefined
        if (value === null || value === undefined) return '""';
        // Escape quotes and wrap in quotes if contains comma, newline, or quotes
        const stringValue = String(value);
        if (
          stringValue.includes(",") ||
          stringValue.includes("\n") ||
          stringValue.includes('"')
        ) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      })
      .join(",");
  });

  return [csvHeaders, ...csvRows].join("\n");
}
