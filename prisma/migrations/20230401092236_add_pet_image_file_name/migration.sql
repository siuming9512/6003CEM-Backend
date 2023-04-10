-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Pet" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "variety" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "imageFileName" TEXT NOT NULL DEFAULT ''
);
INSERT INTO "new_Pet" ("age", "gender", "id", "variety") SELECT "age", "gender", "id", "variety" FROM "Pet";
DROP TABLE "Pet";
ALTER TABLE "new_Pet" RENAME TO "Pet";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
