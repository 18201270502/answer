class User {
    private userInfo;
    public totalScore: number;
    public currentLevelScore: number;
    constructor(userInfo) {
        this.totalScore = userInfo.score || 0;
        this.currentLevelScore = 0;
        this.userInfo = userInfo;
    }
    public get name() {
        return this.userInfo.name;
    }
}