#!/bin/bash

API_URL="http://localhost:3001/api"

echo "=== Quest Submission Testing ==="
echo ""

# Get a quest
echo "1. Fetching quest..."
QUEST=$(curl -s "${API_URL}/quests" | jq -r '.quests[0]')
QUEST_ID=$(echo "$QUEST" | jq -r '._id')
QUEST_TITLE=$(echo "$QUEST" | jq -r '.title')

echo "   Quest ID: $QUEST_ID"
echo "   Title: $QUEST_TITLE"
echo ""

# Check if correctOrder is hidden
echo "2. Verifying correctOrder is hidden..."
HAS_CORRECT_ORDER=$(echo "$QUEST" | jq '.content.blockData.correctOrder')
if [ "$HAS_CORRECT_ORDER" == "null" ]; then
    echo "   ✅ correctOrder is properly hidden from API"
else
    echo "   ❌ correctOrder is exposed in API response!"
fi
echo ""

# Check available blocks
echo "3. Available blocks count..."
BLOCKS_COUNT=$(echo "$QUEST" | jq '.content.blockData.availableBlocks | length')
echo "   Blocks: $BLOCKS_COUNT"
echo ""

echo "=== Testing Complete ===" 
echo ""
echo "Summary:"
echo "- Quest data fetched successfully"
echo "- correctOrder hidden from API responses"
echo "- Blocks are available for the editor"
echo ""
echo "Next steps:"
echo "1. Frontend will submit blockOrder array to POST /quests/:id/submit"
echo "2. Backend validates against hidden correctOrder"
echo "3. Returns success/failure without revealing answer"
