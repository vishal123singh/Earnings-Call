# -------------------
# Build Stage
# -------------------
    FROM node:20-alpine AS builder

    # Set working directory
    WORKDIR /app
    
    # Copy package.json and package-lock.json first to leverage Docker caching
    COPY package.json package-lock.json ./
    
    # Install dependencies
    RUN npm install --frozen-lockfile
    
    # Copy the entire project
    COPY . .
    
    # Build the Next.js app (App Router support included)
    RUN npm run build
    
    # -------------------
    # Production Stage
    # -------------------
    FROM node:20-alpine AS runner
    
    # Set working directory
    WORKDIR /app
    
    # Copy necessary files from the build stage
    COPY --from=builder /app/package.json /app/package.json
    COPY --from=builder /app/node_modules /app/node_modules
    COPY --from=builder /app/.next /app/.next
    COPY --from=builder /app/public /app/public
    COPY --from=builder /app/.env /app/.env

    
    # Set environment to production
    ENV NODE_ENV=production
    
    # Expose the port Next.js runs on
    EXPOSE 3000
    ENV HOSTNAME "0.0.0.0"
    
    # Run the Next.js app
    CMD ["npm", "run", "start"]
    