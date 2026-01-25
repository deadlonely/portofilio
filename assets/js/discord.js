document.addEventListener('DOMContentLoaded', () => {
    const userId = "922522289159954442"; //replace your discord id here
    const apiUrl = `https://discord-lookup-api-alpha.vercel.app/v1/user/${userId}`;

    const avatarFrame = document.getElementById('avatar-frame');

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
                console.log("API Response:", data);

                // set discord widget avatar and username if available
                try {
                    const discordAvatarElem = document.getElementById('discord-avatar');
                    const discordUsernameElem = document.getElementById('discord-username');

                    let avatarSrc = './assets/pfp/default.png';
                    if (data.avatar_url) {
                        avatarSrc = data.avatar_url;
                    } else {
                        // support both string hash and object forms returned by the lookup API
                        let avatarHash = null;
                        let avatarAnimated = false;
                        if (typeof data.avatar === 'string') {
                            avatarHash = data.avatar;
                            avatarAnimated = avatarHash.startsWith('a_');
                        } else if (data.avatar && typeof data.avatar === 'object') {
                            avatarHash = data.avatar.id || null;
                            avatarAnimated = !!(data.avatar.animated || data.avatar.is_animated);
                        } else if (data.user && data.user.avatar) {
                            if (typeof data.user.avatar === 'string') {
                                avatarHash = data.user.avatar;
                                avatarAnimated = avatarHash.startsWith('a_');
                            } else if (typeof data.user.avatar === 'object') {
                                avatarHash = data.user.avatar.id || null;
                                avatarAnimated = !!(data.user.avatar.animated || data.user.avatar.is_animated);
                            }
                        }

                        if (avatarHash) {
                            const ext = avatarAnimated ? 'gif' : 'png';
                            avatarSrc = `https://cdn.discordapp.com/avatars/${userId}/${avatarHash}.${ext}?size=512`;
                        }
                    }

                                        if (discordAvatarElem) discordAvatarElem.src = avatarSrc;
                                        if (discordUsernameElem) {
                                            const name = data.username || (data.user && data.user.username) || '';
                                            const discrim = data.discriminator || (data.user && data.user.discriminator) || data.discrim || '';
                                            discordUsernameElem.textContent = name ? (discrim ? `${name}#${discrim}` : name) : '';
                                        }

                                        // set status if available from lookup
                                        try {
                                                const statusDot = document.getElementById('discord-status-dot');
                                                const statusText = document.getElementById('discord-status-text');
                                                const lookupStatus = data.status || data.discord_status || data.presence || (data.user && data.user.status);
                                                const normalized = (lookupStatus || '').toString().toLowerCase();
                                                const allowed = ['online', 'idle', 'dnd', 'do_not_disturb', 'offline', 'invisible'];
                                                let finalStatus = 'offline';
                                                if (allowed.includes(normalized)) {
                                                    if (normalized === 'do_not_disturb') finalStatus = 'dnd';
                                                    else if (normalized === 'invisible') finalStatus = 'offline';
                                                    else finalStatus = normalized === 'dnd' ? 'dnd' : normalized;
                                                }
                                                if (statusDot) statusDot.className = `status-${finalStatus}`;
                                                if (statusText) statusText.textContent = finalStatus.charAt(0).toUpperCase() + finalStatus.slice(1);
                                        } catch (e) {
                                                // non-fatal
                                        }
                } catch (e) {
                    console.warn('Failed to set discord avatar/username from lookup API', e);
                }

                if (data.avatar_decoration && data.avatar_decoration.asset) {
                    const asset = data.avatar_decoration.asset;
                    const frameUrl = `https://cdn.discordapp.com/avatar-decoration-presets/${asset}.png`;
                    avatarFrame.src = frameUrl;
                    avatarFrame.style.display = 'block';
                } else {
                    console.warn("No avatar frame asset found.");
                    avatarFrame.style.display = 'none';
                }
        })
        .catch(error => {
            console.error("Error fetching user data:", error);
        });
});