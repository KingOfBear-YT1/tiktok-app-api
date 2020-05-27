import { User, UserInfo, Video, VideoInfo, Audio, AudioInfo, Tag, TagInfo } from './types';
import { ILLEGAL_IDENTIFIER, RESOURCE_NOT_FOUND, VIDEO_NOT_FOUND } from './constants';
import { IllegalIdentifier } from './errors/IllegalIdentifier';
import { ResourceNotFound } from './errors/ResourceNotFound';

import utility = require('./utility');
import url = require('./url');
import constructor = require('./constructor');

/**
 * Retrieves the top trending videos on TikTok. Currently returns a maximum of 30 videos.
 */
export async function getTrendingVideos(): Promise<VideoInfo[]> {
    const contentURL = url.getTrendingContentURL();
    const content = await utility.getTiktokContent(contentURL);

    return content.items.map((v: object) => constructor.getVideoInfoFromContent(v));
}

/**
 * @param username The username of the TikTok user.
 * @returns A promise with the resolved value of a User object.
 * @throws {IllegalIdentifier} Thrown if the username is invalid.
 * @throws {ResourceNotFound} Thrown if a User with the username is not found.
 */
export async function getUserByName(username: string): Promise<User> {
    const userInfo = await getUserInfo(username);

    return userInfo.user;
}

/**
 * @param id The unique ID of the TikTok user.
 * @returns A User object with a set id property. Will not fetch the username of the TikTok user.
 */
export function getUserByID(id: string): User {
    return constructor.getUserFromID(id);
}

/**
 * Retrieves the information associated with a TikTok user.
 * @param identifier The User object of a TikTok user or a TikTok user's username.
 * @returns A promise with the resolved value of a UserInfo object.
 * @throws {IllegalIdentifier} Thrown if the username of the User object or the passed username is invalid.
 * @throws {ResourceNotFound} Thrown if a User with the username is not found.
 * @throws {IllegalArgument} Thrown if the User object, if one was passed, does not have it's username property set. 
 */
export async function getUserInfo(identifier: User | string): Promise<UserInfo> {
    const contentURL = url.getUserInfoContentURL(identifier);
    const content = await utility.getTiktokContent(contentURL);

    if (content.statusCode === ILLEGAL_IDENTIFIER) {
        throw new IllegalIdentifier("An illegal identifier was used for this request.");
    } else if (content.statusCode === RESOURCE_NOT_FOUND) {
        throw new ResourceNotFound("Could not find a User with the given identifier.");
    }

    return constructor.getUserInfoFromContent(content);
}

/**
 * Retrieves the information of the latest videos of a TikTok user. Currently returns a maximum of 30 videos.
 * @param user The User object of a TikTok user.
 * @returns A promise with the resolved value of an array of VideoInfo objects.
 *          The resolved value will be an empty array if none videos are found.
 * @throws {IllegalArgument} Thrown if the User object does not have it's id property set.
 */
export async function getRecentVideos(user: User): Promise<VideoInfo[]> {
    const contentURL = url.getRecentVideosContentURL(user);
    const content = await utility.getTiktokContent(contentURL);

    if (typeof content.items === 'undefined') {
        return [];
    }

    return content.items.map((v: object) => constructor.getVideoInfoFromContent(v));
}

/**
 * Retrieves the information of the liked videos of a TikTok user. Currently returns a maximum of 30 videos.
 * @param user The User object of a TikTok user.
 * @returns A promise with the resolved value of an array of VideoInfo objects.
 *          The resolved value will be an empty array if none videos are found.
 * @throws {IllegalArgument} Thrown if the User object does not have it's id property set.
 */
export async function getLikedVideos(user: User): Promise<VideoInfo[]> {
    const contentURL = url.getLikedVideosContentURL(user);
    const content = await utility.getTiktokContent(contentURL);

    if (typeof content.items === 'undefined') {
        return [];
    }

    return content.items.map((v: object) => constructor.getVideoInfoFromContent(v));
}

/**
 * @param id The unique ID of the TikTok video.
 * @returns A Video object with a set id property.
 */
export function getVideo(id: string): Video {
    return constructor.getVideoFromID(id);
}

/**
 * Retrieves the information associated with a TikTok video.
 * @param identifier The Video object of a TikTok video.
 * @returns A promise with the resolved value of a VideoInfo object.
 * @throws {IllegalIdentifier} Thrown if the id of the Video object is invalid.
 * @throws {ResourceNotFound} Thrown if a Video with the id is not found.
 * @throws {IllegalArgument} Thrown if the Video object does not have it's id property set. 
 */
export async function getVideoInfo(video: Video): Promise<VideoInfo> {
    const contentURL = url.getVideoInfoContentURL(video);
    const content = await utility.getTiktokContent(contentURL);

    if (content.statusCode === ILLEGAL_IDENTIFIER) {
        throw new IllegalIdentifier("An illegal identifier was used for this request.");
    } else if (content.statusCode === VIDEO_NOT_FOUND) {
        throw new ResourceNotFound("Could not find a Video with the given identifier.");
    }

    return constructor.getVideoInfoFromContent(content.itemInfo.itemStruct);
}

/**
 * @param id The unique ID of the TikTok audio.
 * @returns An Audio object with a set id property.
 */
export function getAudio(id: string): Audio {
    return constructor.getAudioFromID(id);
}

/**
 * Retrieves the information associated with a TikTok audio.
 * @param identifier The Audio object of a TikTok audio.
 * @returns A promise with the resolved value of a AudioInfo object.
 * @throws {IllegalIdentifier} Thrown if the id of the Audio object is invalid.
 * @throws {ResourceNotFound} Thrown if an Audio with the id is not found.
 * @throws {IllegalArgument} Thrown if the Audio object does not have it's id property set.
 */
export async function getAudioInfo(audio: Audio): Promise<AudioInfo> {
    const contentURL = url.getAudioInfoContentURL(audio);
    const content = await utility.getTiktokContent(contentURL);

    if (content.statusCode === ILLEGAL_IDENTIFIER) {
        throw new IllegalIdentifier("An illegal identifier was used for this request.");
    } else if (content.statusCode === RESOURCE_NOT_FOUND) {
        throw new ResourceNotFound("Could not find an Audio with the given identifier.");
    }

    return constructor.getAudioInfoFromContent(content);
}

/**
 * Retrieves the top videos of a TikTok audio. Currently returns a maximum of 30 videos.
 * @param audio The Audio object of a TikTok audio.
 * @returns A promise with the resolved value of an array of VideoInfo objects.
 * @throws {IllegalArgument} Thrown if the Audio object does not have it's id property set.
 */
export async function getAudioTopVideos(audio: Audio): Promise<VideoInfo[]> {
    const contentURL = url.getAudioTopContentURL(audio);
    const content = await utility.getTiktokContent(contentURL);

    return content.body.itemListData.map((v: object) => constructor.getVideoInfoFromTopContent(v));
}

/**
 * @param id The unique ID of the TikTok tag.
 * @returns A Tag object with set id and title properties. Will fetch the title from the TikTok API.
 * @throws {ResourceNotFound} Thrown if a Tag with the id is not found.
 */
export async function getTag(id: string): Promise<Tag> {
    const tagInfo = await getTagInfo(id);

    return tagInfo.tag;
}

/**
 * Retrieves the information associated with a TikTok tag.
 * @param identifier The Tag object of a TikTok tag or a TikTok tag's id.
 * @returns A promise with the resolved value of a TagInfo object.
 * @throws {ResourceNotFound} Thrown if a Tag with the id is not found.
 * @throws {IllegalArgument} Thrown if the Tag object does not have it's id property set.
 */
export async function getTagInfo(tag: Tag | string): Promise<TagInfo> {
    const contentURL = url.getTagInfoContentURL(tag);
    const content = await utility.getTiktokContent(contentURL);

    if (content.statusCode === RESOURCE_NOT_FOUND) {
        throw new ResourceNotFound("Could not find a Tag with the given identifier.");
    }

    return constructor.getTagInfoFromContent(content);
}

/**
 * Retrieves the top videos of a TikTok tag. Currently returns a maximum of 30 videos.
 * @param audio The Tag object of a TikTok tag.
 * @returns A promise with the resolved value of an array of VideoInfo objects.
 * @throws {IllegalArgument} Thrown if the Tag object does not have it's id property set.
 */
export async function getTagTopVideos(tag: Tag): Promise<VideoInfo[]> {
    const contentURL = url.getTagTopContentURL(tag);
    const content = await utility.getTiktokContent(contentURL);

    return content.body.itemListData.map((v: object) => constructor.getVideoInfoFromTopContent(v));
}