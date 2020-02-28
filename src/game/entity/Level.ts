interface LevelTask {
    seq: number;
    tasks: Question[];
}

class Level {
    // 每关试题数
    private questionsNum: number;
    // 当前总共闯关的试题
    private levelTaskList: LevelTask[];
    // 当前关卡做过的题
    private hasAnswerCurrentLevel: Question[];
    // 当前关卡
    public currentLevel: LevelTask; 

    constructor(questionNum = 10) {
        this.questionsNum = questionNum;
        this.levelTaskList = [];
        this.hasAnswerCurrentLevel = [];
    }

    // 当前关卡是否完成
    public get isFinishedCurrentLevel() {
        return this.currentLevel && this.currentLevel.tasks.length === this.hasAnswerCurrentLevel.length;
    }

    // 获取当前试题详情
    public getQuestion() {
        return {
            index: this.hasAnswerCurrentLevel.length - 1,
            question: this.hasAnswerCurrentLevel[this.hasAnswerCurrentLevel.length - 1],
        };
    }

    // 获取下一道试题详情
    public getNextQuestion() {
        const detail = {
            index: this.hasAnswerCurrentLevel.length,
            question: this.currentLevel.tasks[this.hasAnswerCurrentLevel.length],
        };
        this.hasAnswerCurrentLevel.push(detail.question);
        return detail;
    }
    
    // 拉取下一关卡试题数据
    public async pullNextLevelQuestions() {
        const seq = this.currentLevel ? ++this.currentLevel.seq : 0;
        this.currentLevel = {
            seq,
            tasks: await this.requestQuestions(seq, this.questionsNum),
        }
        this.hasAnswerCurrentLevel.length = 0;
        this.levelTaskList.push(this.currentLevel);
    }

    // 拉取试题详情数据
    private async requestQuestions(level = 0, num = 10) {
        const url = `https://games.cbh.ideabeat.cn/question/list?offset=${level}&limit=${num}`;
        return Ajax.get(url) as Promise<Question[]>;
    }

    public reset() {
        // 清空之前关卡的数据
        this.levelTaskList = [];
        // 强制结束
        this.hasAnswerCurrentLevel = this.currentLevel.tasks;
    }
}