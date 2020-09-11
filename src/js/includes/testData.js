function TestData() {
    this.login = {
        email: 'test123@test123.se',
        password: 'aaaaaaaa' 
    }
    
    this.signUp1 = { //complete success
        name: 'Egyuik wewewe',
        email: 'test123@test123.se',
        password: 'aaaaaaaa',
        comfirmPw: 'aaaaaaaa',
    }
    this.signUp2 = { // invaidname and email (misses "."), password too short and doesn't match comfirm
        name: 'Egyuik',
        email: 'test123@test123se',
        password: 'aaaaaaa',
        comfirmPw: 'aaaaaaaa',
    }
    this.signUp3 = { // invaidname and email (misses "@"), comfirm doesn't match password
        name: 'Egyuik',
        email: 'test123test123.se',
        password: 'aaaaaaaa',
        comfirmPw: 'aaaaaaa',
    }
    this.cookie = () => { // true; hej; false;
        cookie.create('name', 'hej', 5)
        console.log(cookie.check('name'))
        console.log(cookie.get('name'))
        cookie.destroy('name')
        console.log(cookie.check('name'))
    }
    this.frameJson = {
        title: "My first board",
        description: "My first board",
        author: "",
        timestampCreated: "",
        timestampUpdated: "",
        members: [],
        boxes: [
            {
                id: 0,
                name: "To-do", 
                color: "white",
                tasks: [
                    { 
                        id: 0,
                        text: "Create a team board by clicking on 'Boards' > 'Create board' in the top left corner of the screen", 
                        description: "", 
                        members: [], 
                        color: "RED", 
                        date: "",
                        subtasks: [], 
                        labels: ["New-task"]
                    },
                    { 
                        id: 1,
                        text: "To edit a task simply click on it", 
                        description: "*Descriptions can be useful to explain a task in more detail.* \n\nYou can *bold* and _emphasize_ important words. You can add bullet lists:\n\n* Item 1\n* Item 2\n* Item 3\n* item 4", 
                        members: [], 
                        color: "BLUE", 
                        date: "",
                        subtasks: [
                            {
                                id: 0,
                                text: "Create a subtask",
                                state: "true",
                                member: []
                            },
                            {
                                id: 1,
                                text: "Deleat a subtask",
                                state: "false",
                                member: []
                            }
                        ], 
                        labels: ["New-task"]
                    },
                    { 
                        id: 0,
                        text: "Create a team board by clicking on 'Boards' > 'Create board' in the top left corner of the screen", 
                        description: "", 
                        members: [], 
                        color: "RED", 
                        date: "",
                        subtasks: [], 
                        labels: ["New-task"]
                    },
                    { 
                        id: 1,
                        text: "To edit a task simply click on it", 
                        description: "*Descriptions can be useful to explain a task in more detail.* \n\nYou can *bold* and _emphasize_ important words. You can add bullet lists:\n\n* Item 1\n* Item 2\n* Item 3\n* item 4", 
                        members: [], 
                        color: "BLUE", 
                        date: "",
                        subtasks: [
                            {
                                id: 0,
                                text: "Create a subtask",
                                state: "true",
                                member: []
                            },
                            {
                                id: 1,
                                text: "Deleat a subtask",
                                state: "false",
                                member: []
                            }
                        ], 
                        labels: ["New-task"]
                    }
                ]
            },
            {
                id: 0,
                name: "To-do", 
                color: "white",
                tasks: [
                    { 
                        id: 0,
                        text: "Create a team board by clicking on 'Boards' > 'Create board' in the top left corner of the screen", 
                        description: "", 
                        members: [], 
                        color: "RED", 
                        date: "",
                        subtasks: [], 
                        labels: ["New-task"]
                    },
                    { 
                        id: 1,
                        text: "To edit a task simply click on it", 
                        description: "*Descriptions can be useful to explain a task in more detail.* \n\nYou can *bold* and _emphasize_ important words. You can add bullet lists:\n\n* Item 1\n* Item 2\n* Item 3\n* item 4", 
                        members: [], 
                        color: "BLUE", 
                        date: "",
                        subtasks: [
                            {
                                id: 0,
                                text: "Create a subtask",
                                state: "true",
                                member: []
                            },
                            {
                                id: 1,
                                text: "Deleat a subtask",
                                state: "false",
                                member: []
                            }
                        ], 
                        labels: ["New-task"]
                    },
                    { 
                        id: 0,
                        text: "Create a team board by clicking on 'Boards' > 'Create board' in the top left corner of the screen", 
                        description: "", 
                        members: [], 
                        color: "RED", 
                        date: "",
                        subtasks: [], 
                        labels: ["New-task"]
                    },
                    { 
                        id: 1,
                        text: "To edit a task simply click on it", 
                        description: "*Descriptions can be useful to explain a task in more detail.* \n\nYou can *bold* and _emphasize_ important words. You can add bullet lists:\n\n* Item 1\n* Item 2\n* Item 3\n* item 4", 
                        members: [], 
                        color: "BLUE", 
                        date: "",
                        subtasks: [
                            {
                                id: 0,
                                text: "Create a subtask",
                                state: "true",
                                member: []
                            },
                            {
                                id: 1,
                                text: "Deleat a subtask",
                                state: "false",
                                member: []
                            }
                        ], 
                        labels: ["New-task"]
                    }
                ]
            },
            {
                id: 0,
                name: "To-do", 
                color: "white",
                tasks: [
                    { 
                        id: 0,
                        text: "Create a team board by clicking on 'Boards' > 'Create board' in the top left corner of the screen", 
                        description: "", 
                        members: [], 
                        color: "RED", 
                        date: "",
                        subtasks: [], 
                        labels: ["New-task"]
                    },
                    { 
                        id: 1,
                        text: "To edit a task simply click on it", 
                        description: "*Descriptions can be useful to explain a task in more detail.* \n\nYou can *bold* and _emphasize_ important words. You can add bullet lists:\n\n* Item 1\n* Item 2\n* Item 3\n* item 4", 
                        members: [], 
                        color: "BLUE", 
                        date: "",
                        subtasks: [
                            {
                                id: 0,
                                text: "Create a subtask",
                                state: "true",
                                member: []
                            },
                            {
                                id: 1,
                                text: "Deleat a subtask",
                                state: "false",
                                member: []
                            }
                        ], 
                        labels: ["New-task"]
                    },
                    { 
                        id: 0,
                        text: "Create a team board by clicking on 'Boards' > 'Create board' in the top left corner of the screen", 
                        description: "", 
                        members: [], 
                        color: "RED", 
                        date: "",
                        subtasks: [], 
                        labels: ["New-task"]
                    },
                    { 
                        id: 1,
                        text: "To edit a task simply click on it", 
                        description: "*Descriptions can be useful to explain a task in more detail.* \n\nYou can *bold* and _emphasize_ important words. You can add bullet lists:\n\n* Item 1\n* Item 2\n* Item 3\n* item 4", 
                        members: [], 
                        color: "BLUE", 
                        date: "",
                        subtasks: [
                            {
                                id: 0,
                                text: "Create a subtask",
                                state: "true",
                                member: []
                            },
                            {
                                id: 1,
                                text: "Deleat a subtask",
                                state: "false",
                                member: []
                            }
                        ], 
                        labels: ["New-task"]
                    }
                ]
            },
            {
                id: 0,
                name: "To-do", 
                color: "white",
                tasks: [
                    { 
                        id: 0,
                        text: "Create a team board by clicking on 'Boards' > 'Create board' in the top left corner of the screen", 
                        description: "", 
                        members: [], 
                        color: "RED", 
                        date: "",
                        subtasks: [], 
                        labels: ["New-task"]
                    },
                    { 
                        id: 1,
                        text: "To edit a task simply click on it", 
                        description: "*Descriptions can be useful to explain a task in more detail.* \n\nYou can *bold* and _emphasize_ important words. You can add bullet lists:\n\n* Item 1\n* Item 2\n* Item 3\n* item 4", 
                        members: [], 
                        color: "BLUE", 
                        date: "",
                        subtasks: [
                            {
                                id: 0,
                                text: "Create a subtask",
                                state: "true",
                                member: []
                            },
                            {
                                id: 1,
                                text: "Deleat a subtask",
                                state: "false",
                                member: []
                            }
                        ], 
                        labels: ["New-task"]
                    },
                    { 
                        id: 0,
                        text: "Create a team board by clicking on 'Boards' > 'Create board' in the top left corner of the screen", 
                        description: "", 
                        members: [], 
                        color: "RED", 
                        date: "",
                        subtasks: [], 
                        labels: ["New-task"]
                    },
                    { 
                        id: 1,
                        text: "To edit a task simply click on it", 
                        description: "*Descriptions can be useful to explain a task in more detail.* \n\nYou can *bold* and _emphasize_ important words. You can add bullet lists:\n\n* Item 1\n* Item 2\n* Item 3\n* item 4", 
                        members: [], 
                        color: "BLUE", 
                        date: "",
                        subtasks: [
                            {
                                id: 0,
                                text: "Create a subtask",
                                state: "true",
                                member: []
                            },
                            {
                                id: 1,
                                text: "Deleat a subtask",
                                state: "false",
                                member: []
                            }
                        ], 
                        labels: ["New-task"]
                    }
                ]
            },
            {
                id: 0,
                name: "To-do", 
                color: "white",
                tasks: [
                    { 
                        id: 0,
                        text: "Create a team board by clicking on 'Boards' > 'Create board' in the top left corner of the screen", 
                        description: "", 
                        members: [], 
                        color: "RED", 
                        date: "",
                        subtasks: [], 
                        labels: ["New-task"]
                    },
                    { 
                        id: 1,
                        text: "To edit a task simply click on it", 
                        description: "*Descriptions can be useful to explain a task in more detail.* \n\nYou can *bold* and _emphasize_ important words. You can add bullet lists:\n\n* Item 1\n* Item 2\n* Item 3\n* item 4", 
                        members: [], 
                        color: "BLUE", 
                        date: "",
                        subtasks: [
                            {
                                id: 0,
                                text: "Create a subtask",
                                state: "true",
                                member: []
                            },
                            {
                                id: 1,
                                text: "Deleat a subtask",
                                state: "false",
                                member: []
                            }
                        ], 
                        labels: ["New-task"]
                    },
                    { 
                        id: 0,
                        text: "Create a team board by clicking on 'Boards' > 'Create board' in the top left corner of the screen", 
                        description: "", 
                        members: [], 
                        color: "RED", 
                        date: "",
                        subtasks: [], 
                        labels: ["New-task"]
                    },
                    { 
                        id: 1,
                        text: "To edit a task simply click on it", 
                        description: "*Descriptions can be useful to explain a task in more detail.* \n\nYou can *bold* and _emphasize_ important words. You can add bullet lists:\n\n* Item 1\n* Item 2\n* Item 3\n* item 4", 
                        members: [], 
                        color: "BLUE", 
                        date: "",
                        subtasks: [
                            {
                                id: 0,
                                text: "Create a subtask",
                                state: "true",
                                member: []
                            },
                            {
                                id: 1,
                                text: "Deleat a subtask",
                                state: "false",
                                member: []
                            }
                        ], 
                        labels: ["New-task"]
                    }
                ]
            },
            {
                id: 0,
                name: "To-do", 
                color: "white",
                tasks: [
                    { 
                        id: 0,
                        text: "Create a team board by clicking on 'Boards' > 'Create board' in the top left corner of the screen", 
                        description: "", 
                        members: [], 
                        color: "RED", 
                        date: "",
                        subtasks: [], 
                        labels: ["New-task"]
                    },
                    { 
                        id: 1,
                        text: "To edit a task simply click on it", 
                        description: "*Descriptions can be useful to explain a task in more detail.* \n\nYou can *bold* and _emphasize_ important words. You can add bullet lists:\n\n* Item 1\n* Item 2\n* Item 3\n* item 4", 
                        members: [], 
                        color: "BLUE", 
                        date: "",
                        subtasks: [
                            {
                                id: 0,
                                text: "Create a subtask",
                                state: "true",
                                member: []
                            },
                            {
                                id: 1,
                                text: "Deleat a subtask",
                                state: "false",
                                member: []
                            }
                        ], 
                        labels: ["New-task"]
                    },
                    { 
                        id: 0,
                        text: "Create a team board by clicking on 'Boards' > 'Create board' in the top left corner of the screen", 
                        description: "", 
                        members: [], 
                        color: "RED", 
                        date: "",
                        subtasks: [], 
                        labels: ["New-task"]
                    },
                    { 
                        id: 1,
                        text: "To edit a task simply click on it", 
                        description: "*Descriptions can be useful to explain a task in more detail.* \n\nYou can *bold* and _emphasize_ important words. You can add bullet lists:\n\n* Item 1\n* Item 2\n* Item 3\n* item 4", 
                        members: [], 
                        color: "BLUE", 
                        date: "",
                        subtasks: [
                            {
                                id: 0,
                                text: "Create a subtask",
                                state: "true",
                                member: []
                            },
                            {
                                id: 1,
                                text: "Deleat a subtask",
                                state: "false",
                                member: []
                            }
                        ], 
                        labels: ["New-task"]
                    }
                ]
            },
        ],
    }
}