type UserType = 'guest' | 'member' | 'premium';
type Action = 'post' | 'comment' | 'share';

export const calculatePoints = (userType: UserType, action: Action): number => {
  if (userType === 'guest') return 1;

  let points = 0;

  switch (action) {
    case 'comment': points = 2; break;
    case 'post':    points = 5; break;
    case 'share':   points = 10; break;
    default:
      // Defensa para casos de JS/any
      throw new Error("Action not recognized");
  }

  if (userType === 'premium') {
    return points * 2;
  }

  return points;
};