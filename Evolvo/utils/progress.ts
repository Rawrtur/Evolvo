export const progress = (questions: Question[]) => {
    if (questions.length === 0) return 0;
//["short", "long", "medium", "none"]
    const result = questions.map((lec)=>{
        switch (lec.state) {
            case "short": return 1;
            case "medium": return 2;
            case "long": return 3
            default: return 0;
        }
    }).reduce((sum, zahl)=>sum + zahl, 0)
    const sum = questions.filter(q=>q.state !== "none").length * 3;
    return result/sum*100
    
}