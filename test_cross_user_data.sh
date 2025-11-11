#!/bin/bash

# Test script to verify cross-user data displays correctly
# This tests the three critical issues: author names, comments, and likes

set -e  # Exit on error

BASE_URL="http://localhost:8000/api"

echo "================================================"
echo "Cross-User Data Display Test"
echo "================================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Create two users
echo -e "${YELLOW}Step 1: Creating two test users${NC}"
echo ""

echo "Creating User A (Alice)..."
USER_A_RESPONSE=$(curl -s -X POST "$BASE_URL/Authentication/registerAndCreateAccount" \
  -H "Content-Type: application/json" \
  -d '{
    "mitKerberos": "alice@mit.edu",
    "username": "Alice Smith",
    "password": "password123"
  }')

USER_A_ID=$(echo $USER_A_RESPONSE | grep -o '"userID":"[^"]*"' | cut -d'"' -f4)
echo "User A ID: $USER_A_ID"

echo ""
echo "Creating User B (Bob)..."
USER_B_RESPONSE=$(curl -s -X POST "$BASE_URL/Authentication/registerAndCreateAccount" \
  -H "Content-Type: application/json" \
  -d '{
    "mitKerberos": "bob@mit.edu",
    "username": "Bob Johnson",
    "password": "password123"
  }')

USER_B_ID=$(echo $USER_B_RESPONSE | grep -o '"userID":"[^"]*"' | cut -d'"' -f4)
echo "User B ID: $USER_B_ID"

# Step 2: Login both users to get tokens
echo ""
echo -e "${YELLOW}Step 2: Logging in both users${NC}"
echo ""

echo "Logging in User A..."
LOGIN_A_RESPONSE=$(curl -s -X POST "$BASE_URL/Authentication/verifyCredentials" \
  -H "Content-Type: application/json" \
  -d '{
    "mitKerberos": "alice@mit.edu",
    "password": "password123"
  }')

TOKEN_A=$(echo $LOGIN_A_RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
echo "User A Token: ${TOKEN_A:0:20}..."

echo ""
echo "Logging in User B..."
LOGIN_B_RESPONSE=$(curl -s -X POST "$BASE_URL/Authentication/verifyCredentials" \
  -H "Content-Type: application/json" \
  -d '{
    "mitKerberos": "bob@mit.edu",
    "password": "password123"
  }')

TOKEN_B=$(echo $LOGIN_B_RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
echo "User B Token: ${TOKEN_B:0:20}..."

# Step 3: Create a room template
echo ""
echo -e "${YELLOW}Step 3: Creating a room template${NC}"
echo ""

TEMPLATE_RESPONSE=$(curl -s -X POST "$BASE_URL/RoomTemplate/addTemplate" \
  -H "Content-Type: application/json" \
  -d '{
    "token": "'"$TOKEN_A"'",
    "dormName": "MacGregor",
    "roomType": "Double"
  }')

TEMPLATE_ID=$(echo $TEMPLATE_RESPONSE | grep -o '"[a-f0-9]\{24\}"' | tr -d '"' | head -1)
echo "Template ID: $TEMPLATE_ID"

# Step 4: User A creates a post
echo ""
echo -e "${YELLOW}Step 4: User A creates a post${NC}"
echo ""

POST_RESPONSE=$(curl -s -X POST "$BASE_URL/DesignPost/createPost" \
  -H "Content-Type: application/json" \
  -d '{
    "token": "'"$TOKEN_A"'",
    "templateID": "'"$TEMPLATE_ID"'",
    "title": "My Awesome Room Design",
    "description": "Check out my cozy setup!",
    "imageURL": "https://example.com/image.jpg"
  }')

POST_ID=$(echo $POST_RESPONSE | grep -o '"[a-f0-9]\{24\}"' | tr -d '"' | head -1)
echo "Post ID: $POST_ID"

# Step 5: TEST 1 - Verify User Profile Retrieval
echo ""
echo -e "${YELLOW}Step 5: TEST 1 - Verify User Profile Retrieval${NC}"
echo ""

echo "Fetching User A's profile..."
USER_A_PROFILE=$(curl -s -X POST "$BASE_URL/UserAccount/getUser" \
  -H "Content-Type: application/json" \
  -d '{
    "userID": "'"$USER_A_ID"'"
  }')

echo "Response: $USER_A_PROFILE"

if echo "$USER_A_PROFILE" | grep -q "Alice Smith"; then
  echo -e "${GREEN}✓ PASS: User profile correctly shows username 'Alice Smith'${NC}"
else
  echo -e "${RED}✗ FAIL: User profile does not show correct username${NC}"
fi

# Step 6: User B likes the post
echo ""
echo -e "${YELLOW}Step 6: User B likes User A's post${NC}"
echo ""

LIKE_RESPONSE=$(curl -s -X POST "$BASE_URL/Engagement/toggleUpvote" \
  -H "Content-Type: application/json" \
  -d '{
    "token": "'"$TOKEN_B"'",
    "postID": "'"$POST_ID"'"
  }')

echo "Like response: $LIKE_RESPONSE"

# Step 7: User B adds a comment
echo ""
echo -e "${YELLOW}Step 7: User B adds a comment${NC}"
echo ""

COMMENT_RESPONSE=$(curl -s -X POST "$BASE_URL/Engagement/addComment" \
  -H "Content-Type: application/json" \
  -d '{
    "token": "'"$TOKEN_B"'",
    "postID": "'"$POST_ID"'",
    "text": "This looks amazing! Great job!"
  }')

echo "Comment response: $COMMENT_RESPONSE"

# Step 8: TEST 2 - Verify Engagement Data Retrieval
echo ""
echo -e "${YELLOW}Step 8: TEST 2 - Verify Engagement Data Retrieval${NC}"
echo ""

echo "Fetching engagement data for the post..."
ENGAGEMENT_RESPONSE=$(curl -s -X POST "$BASE_URL/Engagement/getEngagementForPost" \
  -H "Content-Type: application/json" \
  -d '{
    "postID": "'"$POST_ID"'"
  }')

echo "Response: $ENGAGEMENT_RESPONSE"
echo ""

# Check if User B's ID is in upvotes
if echo "$ENGAGEMENT_RESPONSE" | grep -q "$USER_B_ID"; then
  echo -e "${GREEN}✓ PASS: User B's like is visible in engagement data${NC}"
else
  echo -e "${RED}✗ FAIL: User B's like is NOT visible${NC}"
fi

# Check if the comment text is present
if echo "$ENGAGEMENT_RESPONSE" | grep -q "This looks amazing"; then
  echo -e "${GREEN}✓ PASS: User B's comment is visible in engagement data${NC}"
else
  echo -e "${RED}✗ FAIL: User B's comment is NOT visible${NC}"
fi

# Step 9: TEST 3 - Verify Post Data Shows Author ID
echo ""
echo -e "${YELLOW}Step 9: TEST 3 - Verify Post Data Contains Author ID${NC}"
echo ""

echo "Fetching post data..."
POST_DATA=$(curl -s -X POST "$BASE_URL/DesignPost/getPost" \
  -H "Content-Type: application/json" \
  -d '{
    "postID": "'"$POST_ID"'"
  }')

echo "Response: $POST_DATA"
echo ""

if echo "$POST_DATA" | grep -q "$USER_A_ID"; then
  echo -e "${GREEN}✓ PASS: Post correctly shows authorID${NC}"
else
  echo -e "${RED}✗ FAIL: Post does not show correct authorID${NC}"
fi

# Summary
echo ""
echo "================================================"
echo -e "${YELLOW}TEST SUMMARY${NC}"
echo "================================================"
echo ""
echo "If all tests passed, the three critical issues are fixed:"
echo "  1. Posts should show author names (frontend can fetch via UserAccount/getUser)"
echo "  2. Comments should appear for all users (returned by Engagement/getEngagementForPost)"
echo "  3. Likes should sync properly (returned by Engagement/getEngagementForPost)"
echo ""
echo "Test IDs for manual verification:"
echo "  User A ID: $USER_A_ID"
echo "  User B ID: $USER_B_ID"
echo "  Post ID: $POST_ID"
echo "  Template ID: $TEMPLATE_ID"
echo ""

