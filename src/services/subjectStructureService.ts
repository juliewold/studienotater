import {
  createVideoSubtopic,
  createVideoTopic,
  deleteVideoSubtopic,
  deleteVideoTopic,
  getAllVideoSubtopicsBySubject,
  getVideoSubtopicsByTopic,
  getVideoTopicsBySubject,
  updateVideoSubtopic,
  updateVideoTopic,
  type DatabaseVideoSubtopic,
  type DatabaseVideoTopic,
} from "./videosService";

export type DatabaseTopic = DatabaseVideoTopic;

export type DatabaseSubtopic = DatabaseVideoSubtopic;

export const getTopicsBySubject = getVideoTopicsBySubject;

export const getSubtopicsByTopic = getVideoSubtopicsByTopic;

export const getAllSubtopicsBySubject = getAllVideoSubtopicsBySubject;

export const createTopic = createVideoTopic;

export const updateTopic = updateVideoTopic;

export const deleteTopic = deleteVideoTopic;

export const createSubtopic = createVideoSubtopic;

export const updateSubtopic = updateVideoSubtopic;

export const deleteSubtopic = deleteVideoSubtopic;
