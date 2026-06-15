export async function requestAppNotificationPermission() {
    if (!('Notification' in window)) {
        return {
            supported: false,
            permission: 'unsupported',
        }
    }

    const permission = await Notification.requestPermission()

    return {
        supported: true,
        permission,
    }
}

export function canSendBrowserNotification() {
    return (
        'Notification' in window &&
        Notification.permission === 'granted'
    )
}

export function sendBrowserNotification(title, body) {
    if (!canSendBrowserNotification()) return

    new Notification(title, {
        body,
        icon: '/icon-192.png',
    })
}