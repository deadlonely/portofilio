document.addEventListener('DOMContentLoaded', () => {
  const userId = '922522289159954442'; //replace your discord id here
  const apiUrl = `https://api.lanyard.rest/v1/users/${userId}`;
  
  const avatar = document.getElementById('discord-avatar');
  const username = document.getElementById('discord-username');
  const statusDot = document.getElementById('discord-status-dot');
  const statusText = document.getElementById('discord-status-text');
  const activityInfo = document.getElementById('discord-activity-info');
  const noActivity = document.getElementById('discord-no-activity');
  const activityName = document.getElementById('discord-activity-name');
  const activityDetails = document.getElementById('discord-activity-details');
  const activityState = document.getElementById('discord-activity-state');
  const albumArt = document.getElementById('discord-album-art');
  const CACHE_KEY = 'discord_cache_v1';

  // apply cached values immediately to avoid flicker
  try {
    const cachedRaw = localStorage.getItem(CACHE_KEY);
    if (cachedRaw) {
      const cached = JSON.parse(cachedRaw);
      if (cached) {
        if (cached.avatarSrc) avatar.src = cached.avatarSrc;
        if (cached.username) username.textContent = cached.username;
        if (cached.status) {
          statusDot.className = `status-${cached.status}`;
          statusText.textContent = cached.status.charAt(0).toUpperCase() + cached.status.slice(1);
        }
        if (cached.hasActivity) {
          activityInfo.classList.remove('hidden');
          noActivity.classList.add('hidden');
          activityName.textContent = cached.activityName || '';
          activityDetails.textContent = cached.activityDetails || '';
          activityState.textContent = cached.activityState || '';
          if (cached.albumArtBackground) {
            albumArt.style.backgroundImage = cached.albumArtBackground;
          }
        }
      }
    }
  } catch (e) {
    console.warn('Failed to apply cached discord data:', e);
  }
  
  async function updateDiscordStatus() {
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      console.log('Lanyard response:', data);

      if (data.success) {
        const discord = data.data || {};

        const discordUser = discord.discord_user || {};
        const avatarHash = discordUser.avatar;
        if (avatarHash) {
          const ext = avatarHash.startsWith('a_') ? 'gif' : 'png';
          avatar.src = `https://cdn.discordapp.com/avatars/${userId}/${avatarHash}.${ext}?size=512`;
        } else {
          const discrim = discordUser.discriminator || '0';
          const index = parseInt(discrim, 10) % 5;
          avatar.src = `https://cdn.discordapp.com/embed/avatars/${index}.png`;
        }
        
        // show username with discriminator if available (username#1234)
        const discrim = discordUser.discriminator || discordUser.discrim || '';
        if (discordUser.username) {
          username.textContent = discrim ? `${discordUser.username}#${discrim}` : discordUser.username;
        } else {
          username.textContent = 'Unknown';
        }
        
        const status = discord.discord_status || 'offline';
        statusDot.className = `status-${status}`;
        statusText.textContent = status.charAt(0).toUpperCase() + status.slice(1);
        
        const activities = discord.activities || [];
        const activity = activities.find(a => a.type === 0) || activities.find(a => a.type === 2) || activities[0];
        
        if (activity) {
          activityInfo.classList.remove('hidden');
          noActivity.classList.add('hidden');
          
          activityName.textContent = activity.name;
          activityDetails.textContent = activity.details || '';
          activityState.textContent = activity.state || '';
          
          if (activity.assets?.large_image) {
            let asset = activity.assets.large_image;
            let assetUrl = '';
            if (asset.startsWith('mp:')) {
              assetUrl = getAssetUrl(asset, activity.application_id);
            } else if (asset.startsWith('spotify:')) {
              assetUrl = asset.replace('spotify:', 'https://i.scdn.co/image/');
            } else {
              assetUrl = getAssetUrl(asset, activity.application_id);
            }
            if (assetUrl) albumArt.style.backgroundImage = `url('${assetUrl}')`;
            else albumArt.style.backgroundImage = '';
          } else {
            albumArt.style.backgroundImage = '';
          }
        } else {
          activityInfo.classList.add('hidden');
          noActivity.classList.remove('hidden');
        }
        // save successful state to cache
        try {
          const toCache = {
            avatarSrc: avatar.src,
            username: username.textContent,
            status: (discord.discord_status || 'offline'),
            hasActivity: !!activity,
            activityName: activity ? (activity.name || '') : '',
            activityDetails: activity ? (activity.details || '') : '',
            activityState: activity ? (activity.state || '') : '',
            albumArtBackground: albumArt.style.backgroundImage || ''
          };
          localStorage.setItem(CACHE_KEY, JSON.stringify(toCache));
        } catch (e) {
          console.warn('Failed to write discord cache:', e);
        }
      }
      else {
        console.warn('Lanyard response unsuccessful:', data);
        // preserve current DOM values while trying fallback to avoid flicker
        const currentAvatar = avatar.src;
        const currentUsername = username.textContent;
        const lookupUrl = `https://discord-lookup-api-alpha.vercel.app/v1/user/${userId}`;

            // try to set status if available from lookup
        try {
          const res = await fetch(lookupUrl);
          if (res.ok) {
            const lookupData = await res.json();
            console.log('Lookup API response (fallback):', lookupData);

            let avatarSrc = currentAvatar || './assets/pfp/default.png';
            if (lookupData.avatar_url) {
              avatarSrc = lookupData.avatar_url;
            } else {
              let avatarHash = null;
              let animated = false;
              if (typeof lookupData.avatar === 'string') {
                avatarHash = lookupData.avatar;
                animated = avatarHash.startsWith('a_');
              } else if (lookupData.avatar && typeof lookupData.avatar === 'object') {
                avatarHash = lookupData.avatar.id || null;
                animated = !!(lookupData.avatar.animated || lookupData.avatar.is_animated);
              } else if (lookupData.user && lookupData.user.avatar) {
                if (typeof lookupData.user.avatar === 'string') {
                  avatarHash = lookupData.user.avatar;
                  animated = avatarHash.startsWith('a_');
                } else if (typeof lookupData.user.avatar === 'object') {
                  avatarHash = lookupData.user.avatar.id || null;
                  animated = !!(lookupData.user.avatar.animated || lookupData.user.avatar.is_animated);
                }
              }

              if (avatarHash) {
                const ext = animated ? 'gif' : 'png';
                avatarSrc = `https://cdn.discordapp.com/avatars/${userId}/${avatarHash}.${ext}?size=512`;
              }
            }

            // apply lookup values only if available
            if (avatarSrc) avatar.src = avatarSrc;
            const lookupUsername = lookupData.username || (lookupData.user && lookupData.user.username);
            const lookupDiscrim = lookupData.discriminator || (lookupData.user && lookupData.user.discriminator) || lookupData.discrim || '';
            if (lookupUsername) {
              username.textContent = lookupDiscrim ? `${lookupUsername}#${lookupDiscrim}` : lookupUsername;
            }
            // if lookup provides activity array, try to use it
            if (lookupData.activities && Array.isArray(lookupData.activities)) {
              const lActivity = lookupData.activities.find(a => a.type === 0) || lookupData.activities[0];
              if (lActivity) {
                activityInfo.classList.remove('hidden');
                noActivity.classList.add('hidden');
                activityName.textContent = lActivity.name || '';
                activityDetails.textContent = lActivity.details || '';
                activityState.textContent = lActivity.state || '';
                if (lActivity.assets?.large_image) {
                  const assetUrl = getAssetUrl(lActivity.assets.large_image, lActivity.application_id);
                  albumArt.style.backgroundImage = `url('${assetUrl}')`;
                }
              }
            }
            // determine and apply lookup status before caching
            const lookupStatus = lookupData.status || lookupData.discord_status || lookupData.presence || (lookupData.user && lookupData.user.status);
            const normalized = (lookupStatus || '').toString().toLowerCase();
            const allowed = ['online', 'idle', 'dnd', 'do_not_disturb', 'offline', 'invisible'];
            let finalStatus = 'offline';
            if (allowed.includes(normalized)) {
              if (normalized === 'do_not_disturb') finalStatus = 'dnd';
              else if (normalized === 'invisible') finalStatus = 'offline';
              else finalStatus = normalized === 'dnd' ? 'dnd' : normalized;
            }
            statusDot.className = `status-${finalStatus}`;
            statusText.textContent = finalStatus.charAt(0).toUpperCase() + finalStatus.slice(1);
            // cache lookup fallback
            try {
              const toCache = {
                avatarSrc: avatar.src,
                username: username.textContent,
                status: (finalStatus || 'offline'),
                hasActivity: !!(lookupData.activities && lookupData.activities.length),
                activityName: activityName.textContent,
                activityDetails: activityDetails.textContent,
                activityState: activityState.textContent,
                albumArtBackground: albumArt.style.backgroundImage || ''
              };
              localStorage.setItem(CACHE_KEY, JSON.stringify(toCache));
            } catch (e) {
              console.warn('Failed to write discord lookup cache:', e);
            }
          } else {
            console.warn('Lookup fallback returned non-OK status:', res.status);
            // if there's no current values, set a safe default once
            if (!currentAvatar || currentAvatar.endsWith('default.png') || currentAvatar === '') {
              avatar.src = './assets/pfp/default.png';
            }
            if (!currentUsername || currentUsername === 'Unknown' || currentUsername === '') {
              username.textContent = 'Unknown';
            }
          }
        } catch (e) {
          console.warn('Lookup fallback error:', e);
          if (!currentAvatar || currentAvatar.endsWith('default.png') || currentAvatar === '') {
            avatar.src = './assets/pfp/default.png';
          }
          if (!currentUsername || currentUsername === 'Unknown' || currentUsername === '') {
            username.textContent = 'Unknown';
          }
        }
        statusDot.className = 'status-offline';
        statusText.textContent = 'Offline';
        activityInfo.classList.add('hidden');
        noActivity.classList.remove('hidden');
      }
    } catch (error) {
      console.error('Error fetching Discord status:', error);
    }
  }
  
  function getAssetUrl(asset, applicationId) {
    if (asset.startsWith('mp:')) {
      return `https://media.discordapp.net/${asset.replace('mp:', '')}`;
    }
    return `https://cdn.discordapp.com/app-assets/${applicationId}/${asset}.png`;
  }
  
  updateDiscordStatus();
  setInterval(updateDiscordStatus, 10000);
});