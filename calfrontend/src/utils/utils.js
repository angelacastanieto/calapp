const UserType = Object.freeze({
    COACH:   'coach',
    STUDENT: 'student'
});

export const userIsCoach = (userType) => userType === UserType.COACH