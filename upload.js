import fs from "fs/promises";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { createClient } from "@supabase/supabase-js";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";

// @supabase/supabase-js
try {
  const result = await fs.readFile("source.txt", "utf-8");
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 50,
    separators: ["\n\n", "\n", " ", ""], // default setting
  });

  const output = await splitter.createDocuments([result]);

  const sbApiKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsZnJzdXpkeHh4am55eWpwcGthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDUxNjI5NzUsImV4cCI6MjAyMDczODk3NX0.EegEQE-J05Q7WdN12gbhI6JcPFindaiLxSIWieT4gMo";
  const sbUrl = "https://tlfrsuzdxxxjnyyjppka.supabase.co";
  const openAIApiKey = "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";

  const client = createClient(sbUrl, sbApiKey);

  await SupabaseVectorStore.fromDocuments(
    output,
    new OpenAIEmbeddings({ openAIApiKey }),
    {
      client,
      tableName: "documents",
    }
  );
  console.log("upload complete");
} catch (err) {
  console.log(err);
}
