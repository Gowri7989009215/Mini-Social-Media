# TODO: Fix Like Functionality to Allow Only Once Per User

## Steps to Complete

- [x] Update `server/models/Post.js`: Change `likes` field from Number to [String] (array of emails)
- [x] Update `server/server.js` post creation: Set `likes: []` instead of `likes: 0`
- [x] Update `server/server.js` like route: Add checks for user email, ownership, friendship, and duplicates
- [x] Test the like functionality to ensure restrictions work properly
- [x] Implement forgot password feature with OTP verification
