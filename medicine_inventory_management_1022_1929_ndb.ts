// 代码生成时间: 2025-10-22 19:29:08
// Importing required Deno features
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { ensureDirSync, readJsonSync, writeJsonFileSync } from "https://deno.land/std/fs/mod.ts");

// Define the Medicine interface
interface Medicine {
    id: number;
    name: string;
    quantity: number;
}

// Define the MedicineInventory class
class MedicineInventory {
    private medicines: Medicine[] = [];
    private storagePath: string;

    constructor(storagePath: string) {
        this.storagePath = storagePath;
        this.loadMedicines();
    }

    // Load medicines from storage
    private loadMedicines(): void {
        try {
            const data = readJsonSync(this.storagePath);
            this.medicines = data as Medicine[];
        } catch (error) {
            console.error("Failed to load medicines from storage: ", error);
            this.medicines = [];
        }
    }

    // Save medicines to storage
    private saveMedicines(): void {
        writeJsonFileSync(this.storagePath, this.medicines);
    }

    // Add a new medicine to the inventory
    addMedicine(medicine: Medicine): void {
        this.medicines.push(medicine);
        this.saveMedicines();
    }

    // Update an existing medicine in the inventory
    updateMedicine(id: number, updates: Partial<Medicine>): void {
        const index = this.medicines.findIndex((m) => m.id === id);
        if (index === -1) {
            throw new Error("Medicine not found");
        }
        this.medicines[index] = { ...this.medicines[index], ...updates };
        this.saveMedicines();
    }

    // Delete a medicine from the inventory
    deleteMedicine(id: number): void {
        this.medicines = this.medicines.filter((m) => m.id !== id);
        this.saveMedicines();
    }

    // List all medicines in the inventory
    listMedicines(): Medicine[] {
        return this.medicines;
    }
}

// Example usage of the MedicineInventory class
if (import.meta.main) {
    // Ensure the storage directory exists
    const storagePath = "./medicines.json";
    ensureDirSync(storagePath);

    // Create a new MedicineInventory instance
    const inventory = new MedicineInventory(storagePath);

    // Add some medicines
    inventory.addMedicine({ id: 1, name: "Aspirin", quantity: 100 });
    inventory.addMedicine({ id: 2, name: "Paracetamol", quantity: 150 });

    // Update a medicine
    inventory.updateMedicine(1, { quantity: 120 });

    // Delete a medicine
    inventory.deleteMedicine(2);

    // List all medicines
    const medicines = inventory.listMedicines();
    console.log(medicines);
}
