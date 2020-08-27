SELECT boxs.BOX_ID AS boxs_BOX_ID, 
boxs.TITLE AS boxs_TITLE, 
boxs.FRAME_ID AS boxs_FRAME_ID, 
boxs.COLOR AS boxs_COLOR, 
boxs.QUEUE AS boxs_QUEUE, 
card_member.CARD_ID AS card_member_CARD_ID, 
card_member.USER_ID AS card_member_USER_ID, 
cards.CARD_ID AS cards_CARD_ID, 
cards.TEXT AS cards_TEXT, 
cards.DISCRIPTION, 
cards.BOX_ID AS cards_BOX_ID, 
cards.COLOR AS cards_COLOR, 
cards.CREATED_TIME AS cards_CREATED_TIME, 
cards.QUEUE AS cards_QUEUE, 
color.FRAME_ID AS color_FRAME_ID, 
color.COLOR AS color_COLOR, 
color.TEXT AS color_TEXT, 
frames.FRAME_ID AS frames_FRAME_ID, 
frames.NAME AS frames_NAME, 
frames.USER_ID AS frames_USER_ID, 
frames.CREATED_TIME AS frames_CREATED_TIME, 
labels.CARD_ID AS labels_CARD_ID, 
labels.TITLE AS labels_TITLE, 
members.USER_ID AS members_USER_ID, 
members.FRAME_ID AS members_FRAME_ID, 
members.CREATED_TIME AS members_CREATED_TIME, 
members.RANK, task.TASK_ID AS task_TASK_ID, 
task.CARD_ID AS task_CARD_ID, 
task_members.TASK_QUESTION_ID AS task_members_TASK_QUESTION_ID, 
task_members.USER_ID AS task_members_USER_ID, 
task_question.TASK_QUESTION_ID AS task_question_TASK_QUESTION_ID, 
task_question.TASK_ID AS task_question_TASK_ID, 
task_question.TEXT AS task_question_TEXT, 
task_question.QUEUE AS task_question_QUEUE, 
task_question.STATE, 
users.USER_ID AS users_USER_ID, 
users.NAME AS users_NAME, 
users.PASSWORD, users.EMAIL, 
users.PROFILE_IMG_LINK, 
users.CREATE_TIME
FROM 
(
    (
        users INNER JOIN task_members 
        ON users.[USER_ID] = task_members.[USER_ID]
    ) 
    INNER JOIN 
    (
        (
            frames INNER JOIN 
            (
                (
                    (
                        boxs INNER JOIN (
                            labels INNER JOIN cards 
                            ON labels.[CARD_ID] = cards.[CARD_ID]
                        ) 
                        ON boxs.[BOX_ID] = cards.[BOX_ID]
                    ) 
                    INNER JOIN (
                        task INNER JOIN task_question 
                        ON task.[TASK_ID] = task_question.[TASK_ID]
                    ) ON cards.[CARD_ID] = task.[CARD_ID]
                ) 
                INNER JOIN card_member 
                ON cards.[CARD_ID] = card_member.[CARD_ID]
            ) ON frames.[FRAME_ID] = boxs.[FRAME_ID]) 
            INNER JOIN members 
            ON frames.[FRAME_ID] = members.[FRAME_ID]
    ) ON users.[USER_ID] = frames.[USER_ID]
) 
INNER JOIN color 
ON frames.[FRAME_ID] = color.[FRAME_ID]

WHERE users.USER_ID="1";
