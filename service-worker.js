// Service Worker pour En Fouple
// Permet les notifications push même app fermée

const CACHE_NAME = 'enfouple-v1';

// Installation du Service Worker
self.addEventListener('install', event => {
    console.log('🔧 Service Worker: Installation');
    self.skipWaiting(); // Active immédiatement
});

// Activation du Service Worker
self.addEventListener('activate', event => {
    console.log('✅ Service Worker: Activé');
    event.waitUntil(clients.claim()); // Prend le contrôle immédiatement
});

// Réception des notifications push
self.addEventListener('push', event => {
    console.log('🔔 Service Worker: Push reçu');
    
    if (!event.data) {
        console.log('❌ Pas de données dans le push');
        return;
    }

    try {
        const data = event.data.json();
        console.log('📨 Données push:', data);

        const options = {
            body: data.body || 'Vous avez un nouveau message',
            icon: '/icon-192.png',
            badge: '/icon-192.png',
            tag: 'enfouple-message',
            requireInteraction: false,
            vibrate: [200, 100, 200],
            data: {
                url: data.url || '/'
            }
        };

        event.waitUntil(
            self.registration.showNotification(data.title || '💜 En Fouple', options)
        );
    } catch (error) {
        console.error('❌ Erreur traitement push:', error);
    }
});

// Clic sur la notification
self.addEventListener('notificationclick', event => {
    console.log('👆 Notification cliquée');
    
    event.notification.close();

    event.waitUntil(
        clients.openWindow(event.notification.data.url || '/')
    );
});

// Fetch (optionnel - pas de cache pour l'instant)
self.addEventListener('fetch', event => {
    // Pas de cache pour ne pas interférer avec Supabase realtime
    event.respondWith(fetch(event.request));
});
