// 代码生成时间: 2025-10-06 21:34:38
import { existsSync, ensureDirSync, writeFileSync } from "https://deno.land/std/fs/mod.ts";
import { Coverage } from "https://deno.land/std/testing/coverage.ts";
import { green, red } from "https://deno.land/std/fmt/colors.ts";

// Function to run the tests and collect coverage data.
async function runTests(): Promise<void> {
    try {
        // Initialize coverage collector.
        const coverage = new Coverage();
        await coverage.collect();

        // Output the coverage data to the console.
        console.log(green("Collected test coverage data."));
    } catch (error) {
        console.error(red("Failed to collect test coverage data: "), error);
    }
}

// Function to write coverage report to a file.
function writeCoverageReport(coverageData: CoverageData): void {
    try {
        // Ensure the report directory exists.
        const reportDir = "./coverage_reports";
        ensureDirSync(reportDir);

        // Write the coverage report to a file.
        const reportPath = `${reportDir}/coverage_report.txt`;
        writeFileSync(reportPath, coverageData.toString());

        console.log(green("Coverage report written to: "), reportPath);
    } catch (error) {
        console.error(red("Failed to write coverage report: "), error);
    }
}

// Function to check if the coverage report file exists.
function checkCoverageReportExists(): boolean {
    const reportPath = './coverage_reports/coverage_report.txt';
    return existsSync(reportPath);
}

// Main function to orchestrate the coverage analysis.
async function main(): Promise<void> {
    try {
        // Run tests and collect coverage data.
        await runTests();

        // Check if a coverage report file already exists.
        if (checkCoverageReportExists()) {
            console.log(yellow("A coverage report already exists. Skipping report generation."));
            return;
        }

        // Get the coverage data from the collector.
        const coverageData = Coverage.getData();
        if (coverageData) {
            // Write the coverage data to a report file.
            writeCoverageReport(coverageData);
        } else {
            console.error(red("No coverage data available."));
        }
    } catch (error) {
        console.error(red("An error occurred during coverage analysis: "), error);
    }
}

// Run the coverage analysis.
main();