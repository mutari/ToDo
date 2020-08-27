SELECT users.* frames.* boxs.*
FROM users
INNER JOIN frames
ON users.ID = frames.USER_ID
INNER JOIN boxs
ON frames.ID = boxs.FRAME_ID
;