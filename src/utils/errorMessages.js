const errorMessages = {
    'auth/email-already-in-use': 'This email is already in use. Please try another one.',
    'auth/invalid-email': 'The email address is not valid.',
    'auth/operation-not-allowed': 'Operation not allowed. Please contact support.',
    'auth/weak-password': 'The password is too weak. Please use a stronger password.',
    'auth/user-disabled': 'This user has been disabled. Please contact support.',
    'auth/user-not-found': 'No user found with this email.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/too-many-requests': 'Too many requests. Please try again later.',
    'auth/invalid-login-credentials': 'Invalid login credentials. Please check your email and password.',
  };
  
  export function getErrorMessage(errorCode) {
    return errorMessages[errorCode] || 'An unexpected error occurred. Please try again.';
  }
  