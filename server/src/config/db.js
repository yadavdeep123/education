const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let memoryServer = null;
let connectionMode = "atlas";

const isAtlasUri = (uri) =>
  typeof uri === "string" && (uri.startsWith("mongodb+srv://") || uri.includes(".mongodb.net"));

const isConfiguredUri = (uri) =>
  typeof uri === "string" && uri.trim() !== "" && !uri.includes("<") && !uri.includes(">");

const connectWithUri = async (uri) => {
  return mongoose.connect(uri, {
    serverSelectionTimeoutMS: 15000,
    family: 4,
  });
};

const isSrvDnsError = (error) => {
  return typeof error?.message === "string" && error.message.includes("querySrv");
};

const isStrictAtlasMode = () => {
  if (process.env.REQUIRE_ATLAS === "true") {
    return true;
  }

  return process.env.NODE_ENV === "production";
};

const connectDB = async () => {
  const primaryUri = process.env.MONGO_URI;
  const directAtlasUri = process.env.MONGO_URI_DIRECT;
  const effectivePrimaryUri = isConfiguredUri(primaryUri) ? primaryUri : directAtlasUri;
  const atlasConfigured = isAtlasUri(effectivePrimaryUri);

  if (!effectivePrimaryUri) {
    throw new Error("MONGO_URI is not set (or still contains placeholders)");
  }

  try {
    const conn = await connectWithUri(effectivePrimaryUri);
    connectionMode = atlasConfigured ? "atlas" : "local";
    console.log(`[DB] Connected (${connectionMode}): ${conn.connection.host}`);
    return conn;
  } catch (error) {
    if (atlasConfigured) {
      console.warn(`[DB] Atlas connection failed: ${error.message}`);

      if (isSrvDnsError(error) && isConfiguredUri(directAtlasUri)) {
        try {
          const conn = await connectWithUri(directAtlasUri);
          connectionMode = "atlas";
          console.log(`[DB] Connected (atlas-direct): ${conn.connection.host}`);
          return conn;
        } catch (directError) {
          console.warn(`[DB] Atlas direct connection failed: ${directError.message}`);
        }
      }

      if (isStrictAtlasMode()) {
        throw new Error(
          `${error.message} | Atlas connection failed. Whitelist your current IP in MongoDB Atlas and verify the username/password in MONGO_URI.`
        );
      }
    }

    if (process.env.NODE_ENV !== "production") {
      try {
        const localUri = process.env.LOCAL_MONGO_URI || "mongodb://127.0.0.1:27017/online_classes";
        const conn = await connectWithUri(localUri);

        connectionMode = "local";
        console.log(`[DB] Fallback connected (local): ${conn.connection.host}`);
        return conn;
      } catch (fallbackError) {
        console.warn(`[DB] Local fallback failed: ${fallbackError.message}`);

        try {
          if (!memoryServer) {
            memoryServer = await MongoMemoryServer.create();
          }

          const memoryUri = memoryServer.getUri("online_classes");
          const conn = await connectWithUri(memoryUri);

          connectionMode = "memory";
          console.log(`[DB] Fallback connected (memory): ${conn.connection.host}`);
          return conn;
        } catch (memoryFallbackError) {
          console.error(`[DB] Memory fallback failed: ${memoryFallbackError.message}`);
        }
      }
    }

    if (atlasConfigured) {
      throw new Error(
        `${error.message} | Atlas connection failed. Whitelist your current IP in MongoDB Atlas and verify the username/password in MONGO_URI.`
      );
    }

    throw error;
  }
};

const getDBMode = () => connectionMode;

const disconnectDB = async () => {
  await mongoose.disconnect();

  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
  }
};

module.exports = {
  connectDB,
  disconnectDB,
  getDBMode,
};
