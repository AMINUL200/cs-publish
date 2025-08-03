const getUserTypeLabel = (type) => {
    switch (type) {
        case '1':
        case 1:
            return "Editor";
        case '2':
        case 2:
            return "Author";
        case '3':
        case 3:
            return "Reviewer";
        case '4':
        case 4:
            return "User";
        case '5':
        case 5:
            return "Publisher";
        default:
            return "Unknown";
    }
};

export {
    getUserTypeLabel,
}


