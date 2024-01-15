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

  const sbApiKey = "";

  const sbUrl = "";
  const openAIApiKey = "";

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
