#!/bin/bash
cd backend && node server.js &
sleep 2
cd frontend && npm run dev
