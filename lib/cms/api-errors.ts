export function getAuthErrorStatus(message: string): number {
      if (message.toLowerCase().includes('missing authorization')) {
            return 401;
      }

      if (message.toLowerCase().includes('admin access')) {
            return 403;
      }

      return 500;
}

export function getRequestErrorStatus(message: string): number {
      const normalized = message.toLowerCase();

      if (
            normalized.includes('not found') ||
            normalized.includes('cannot be changed') ||
            normalized.includes('already exists') ||
            normalized.includes('reserved') ||
            normalized.includes('invalid') ||
            normalized.includes('unable to create') ||
            normalized.includes('unpublish the page')
      ) {
            return 400;
      }

      return 500;
}
