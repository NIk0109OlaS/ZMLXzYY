// 代码生成时间: 2025-10-16 18:11:44
import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { join } from "https://deno.land/std/path/mod.ts";
import { readJsonSync, writeJsonSync } from "https://deno.land/std/fs/mod.ts";

// Define the knowledge base structure
interface KnowledgeEntry {
    id: string;
    title: string;
    content: string;
    author: string;
    createdAt: Date;
}

// Define the knowledge base storage
const KNOWLEDGE_BASE_STORAGE = "knowledge_base.json";

// Function to load knowledge base entries from storage
function loadKnowledgeBase(): KnowledgeEntry[] {
    try {
        const data = readJsonSync(KNOWLEDGE_BASE_STORAGE);
        if (!Array.isArray(data)) {
            throw new Error("Invalid knowledge base data format");
        }
        return data;
    } catch (error) {
        console.error("Failed to load knowledge base: ", error);
        return [];
    }
}

// Function to save knowledge base entries to storage
function saveKnowledgeBase(entries: KnowledgeEntry[]): void {
    try {
        writeJsonSync(KNOWLEDGE_BASE_STORAGE, entries);
    } catch (error) {
        console.error("Failed to save knowledge base: ", error);
    }
}

// Function to create a new knowledge entry
function createEntry(entry: Omit<KnowledgeEntry, 'id' | 'createdAt'>): KnowledgeEntry {
    const newEntry: KnowledgeEntry = {
        ...entry,
        id: Deno.randomUUID(),
        createdAt: new Date(),
    };
    return newEntry;
}

// Function to update an existing knowledge entry
function updateEntry(id: string, updatedEntry: Partial<Omit<KnowledgeEntry, 'id' | 'createdAt'>>): KnowledgeEntry | null {
    const entries = loadKnowledgeBase();
    const index = entries.findIndex((entry) => entry.id === id);
    if (index === -1) {
        return null;
    }
    const updatedEntries = entries.map((entry) => {
        if (entry.id === id) {
            return {
                ...entry,
                ...updatedEntry,
                createdAt: entry.createdAt,
            };
        }
        return entry;
    });
    saveKnowledgeBase(updatedEntries);
    return updatedEntries.find((entry) => entry.id === id) || null;
}

// Function to delete a knowledge entry by ID
function deleteEntry(id: string): boolean {
    const entries = loadKnowledgeBase();
    const newEntries = entries.filter((entry) => entry.id !== id);
    saveKnowledgeBase(newEntries);
    return entries.length !== newEntries.length;
}

// Create an instance of the Oak application
const app = new Application();

// Define the router
const router = new Router();

// Routes for knowledge base management
router
    .get("/entries", async (ctx) => {
        const entries = loadKnowledgeBase();
        ctx.response.body = { entries };
    })
    .post("/entries", async (ctx) => {
        try {
            const entry = await ctx.request.body().value;
            const newEntry = createEntry(entry);
            const entries = loadKnowledgeBase();
            entries.push(newEntry);
            saveKnowledgeBase(entries);
            ctx.response.status = 201;
            ctx.response.body = { newEntry };
        } catch (error) {
            ctx.response.status = 400;
            ctx.response.body = { error: error.message };
        }
    })
    .put("/entries/:id", async (ctx) => {
        try {
            const { id } = ctx.params;
            const updatedEntry = await ctx.request.body().value;
            const updated = updateEntry(id, updatedEntry);
            if (updated) {
                ctx.response.status = 200;
                ctx.response.body = { updated };
            } else {
                ctx.response.status = 404;
                ctx.response.body = { error: "Entry not found" };
            }
        } catch (error) {
            ctx.response.status = 400;
            ctx.response.body = { error: error.message };
        }
    })
    .delete("/entries/:id", async (ctx) => {
        try {
            const { id } = ctx.params;
            const success = deleteEntry(id);
            if (success) {
                ctx.response.status = 200;
            } else {
                ctx.response.status = 404;
                ctx.response.body = { error: "Entry not found" };
            }
        } catch (error) {
            ctx.response.status = 500;
            ctx.response.body = { error: error.message };
        }
    });

// Add the router to the application
app.use(router.routes());
app.use(router.allowedMethods());

// Start the server
await app.listen({ port: 8000 });
console.log("Knowledge base management server is running on port 8000");