export type InstagramMediaType = "image" | "video" | "carousel";

export type InstagramProfile = {
  username: string;
  biography: string;
};

export type InstagramPost = {
  id: string;
  caption: string;
  thumbnailUrl: string;
  permalink: string;
  type: InstagramMediaType;
};

export type InstagramFeedResponse =
  | {
      enabled: false;
      profile: null;
      posts: [];
    }
  | {
      enabled: true;
      profile: InstagramProfile;
      posts: InstagramPost[];
    };
