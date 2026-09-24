import { useEffect, useState, type SyntheticEvent } from "react";

import { getConceptsFromDatabase } from "../../services/concepts/conceptService";
import type { Concept } from "../../data/concepts/types";

import {
  addConceptSubtopic,
  getConceptSubtopicLinks,
  removeConceptSubtopic,
} from "../../services/concepts/conceptSubtopicsService";

import {
  getSubtopicById,
  getSubtopicsByTopic,
  getTopicsBySubject,
  type DatabaseSubtopic,
  type DatabaseTopic,
} from "../../services/subjects/subjectStructureService";

export type AdminConceptSubtopicLink = {
  subtopicId: string;
  subtopicName: string;
};

export const useAdminConcepts = () => {
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [isLoadingConcepts, setIsLoadingConcepts] = useState(true);

  const [conceptId, setConceptId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [topicId, setTopicId] = useState("");
  const [subtopicId, setSubtopicId] = useState("");

  const [topics, setTopics] = useState<DatabaseTopic[]>([]);
  const [subtopics, setSubtopics] = useState<DatabaseSubtopic[]>([]);

  const [conceptLinks, setConceptLinks] = useState<AdminConceptSubtopicLink[]>(
    [],
  );

  const [isLoadingTopics, setIsLoadingTopics] = useState(false);
  const [isLoadingSubtopics, setIsLoadingSubtopics] = useState(false);
  const [isLoadingConceptLinks, setIsLoadingConceptLinks] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    let isCancelled = false;

    const loadConcepts = async () => {
      setIsLoadingConcepts(true);

      try {
        const loadedConcepts = await getConceptsFromDatabase();

        if (!isCancelled) {
          setConcepts(loadedConcepts);
        }
      } catch (error) {
        console.error("Kunne ikke hente konsepter:", error);

        if (!isCancelled) {
          setConcepts([]);
          setErrorMessage("Kunne ikke hente konseptene.");
        }
      } finally {
        if (!isCancelled) {
          setIsLoadingConcepts(false);
        }
      }
    };

    void loadConcepts();

    return () => {
      isCancelled = true;
    };
  }, []);

  const handleConceptChange = async (newConceptId: string) => {
    setConceptId(newConceptId);
    setConceptLinks([]);

    setErrorMessage("");
    setSuccessMessage("");

    if (!newConceptId) {
      return;
    }

    setIsLoadingConceptLinks(true);

    try {
      const links = await getConceptSubtopicLinks(newConceptId);

      const loadedSubtopics = await Promise.all(
        links.map((link) => getSubtopicById(link.subtopicId)),
      );

      const loadedLinks = loadedSubtopics
        .filter((subtopic): subtopic is DatabaseSubtopic => Boolean(subtopic))
        .map((subtopic) => ({
          subtopicId: subtopic.id,
          subtopicName: subtopic.name,
        }));

      setConceptLinks(loadedLinks);
    } catch (error) {
      console.error("Kunne ikke hente konseptkoblinger:", error);
      setErrorMessage("Kunne ikke hente konseptkoblingene.");
    } finally {
      setIsLoadingConceptLinks(false);
    }
  };

  const handleSubjectChange = async (newSubjectId: string) => {
    setSubjectId(newSubjectId);
    setTopicId("");
    setSubtopicId("");

    setTopics([]);
    setSubtopics([]);

    setErrorMessage("");
    setSuccessMessage("");

    if (!newSubjectId) {
      return;
    }

    setIsLoadingTopics(true);

    try {
      const loadedTopics = await getTopicsBySubject(newSubjectId);

      setTopics(loadedTopics);
    } catch (error) {
      console.error("Kunne ikke hente temaer:", error);
      setTopics([]);
      setErrorMessage("Kunne ikke hente temaene.");
    } finally {
      setIsLoadingTopics(false);
    }
  };

  const handleTopicChange = async (newTopicId: string) => {
    setTopicId(newTopicId);
    setSubtopicId("");
    setSubtopics([]);

    setErrorMessage("");
    setSuccessMessage("");

    if (!newTopicId) {
      return;
    }

    setIsLoadingSubtopics(true);

    try {
      const loadedSubtopics = await getSubtopicsByTopic(newTopicId);

      setSubtopics(loadedSubtopics);
    } catch (error) {
      console.error("Kunne ikke hente undertemaer:", error);
      setSubtopics([]);
      setErrorMessage("Kunne ikke hente undertemaene.");
    } finally {
      setIsLoadingSubtopics(false);
    }
  };

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    if (!conceptId) {
      setErrorMessage("Du må velge et konsept.");
      return;
    }

    if (!subjectId) {
      setErrorMessage("Du må velge et fag.");
      return;
    }

    if (!topicId) {
      setErrorMessage("Du må velge et tema.");
      return;
    }

    if (!subtopicId) {
      setErrorMessage("Du må velge et undertema.");
      return;
    }

    setIsSaving(true);

    try {
      await addConceptSubtopic(conceptId, subtopicId);

      const selectedSubtopic = subtopics.find(
        (subtopic) => subtopic.id === subtopicId,
      );

      if (
        selectedSubtopic &&
        !conceptLinks.some((link) => link.subtopicId === subtopicId)
      ) {
        setConceptLinks((currentLinks) => [
          ...currentLinks,
          {
            subtopicId: selectedSubtopic.id,
            subtopicName: selectedSubtopic.name,
          },
        ]);
      }

      setSuccessMessage("Konseptet ble koblet til undertemaet.");
    } catch (error) {
      console.error("Kunne ikke lagre konseptkobling:", error);
      setErrorMessage("Kunne ikke lagre konseptkoblingen.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveConceptLink = async (subtopicIdToRemove: string) => {
    if (!conceptId) {
      return;
    }

    setErrorMessage("");
    setSuccessMessage("");

    try {
      await removeConceptSubtopic(conceptId, subtopicIdToRemove);

      setConceptLinks((currentLinks) =>
        currentLinks.filter((link) => link.subtopicId !== subtopicIdToRemove),
      );

      setSuccessMessage("Koblingen ble fjernet.");
    } catch (error) {
      console.error("Kunne ikke fjerne konseptkobling:", error);
      setErrorMessage("Kunne ikke fjerne konseptkoblingen.");
    }
  };

  return {
    concepts,

    conceptId,
    subjectId,
    topicId,
    subtopicId,

    topics,
    subtopics,
    conceptLinks,

    isLoadingConcepts,
    isLoadingTopics,
    isLoadingSubtopics,
    isLoadingConceptLinks,
    isSaving,

    errorMessage,
    successMessage,

    handleConceptChange,
    handleSubjectChange,
    handleTopicChange,
    setSubtopicId,
    handleSubmit,
    handleRemoveConceptLink,
  };
};
