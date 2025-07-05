import { Attachment, Course, Session, StringDouble } from "interface/common";
import create from "zustand";

interface Attendance {
  attachments: { attachment_id: number; test_id?: number }[];
  session_id: number;
}

export interface IAttachmentArray {
  id: number;
  name: StringDouble;
  session_id: number;
}

interface CourseStoreInterface {
  course?: Course;
  setCourse: (data: Course) => void;

  sessionSelected?: Session;
  setSession: (sessionId: number) => void;

  attachmentSelected?: Attachment;
  setAttachment: (
    sessionId: number,
    attachmentId: number,
    selectedCourse: Course
  ) => void;

  updateAttendence: (
    sessionId: string | number,
    attachId: number | string
  ) => void;

  clearCourseStore: () => void;

  // To know when to show the rating card
  lastAttachmentId?: number;
  setLastAttachmentId: (res: Course) => void;

  //
  changeRatingCourseStatus: () => void;

  // For Next and Prev card
  attachmentsArray?: IAttachmentArray[] | undefined;
  setAttachmentsArray: (res: Session[]) => void;
}

export const courseStore = create<CourseStoreInterface>((set: any) => ({
  //   set: (data: any) => set(() => data),
  setCourse: (data) => {
    // Inject (Attended) value; to make things eaiser
    // if the user signin.
    if (data.order) {
      // Create this array to inject the (attended) value
      const updatedSession = [
        ...data.sessions.map((session) => ({
          ...session,
          attachments: [
            ...session.attachments.map((attachment) => ({
              ...attachment,
              attended:
                // Add (if) to make sure the (JSON.parse) don't cause error if its empty string
                data.order?.attendance !== ""
                  ? JSON.parse(data.order?.attendance as string).filter(
                      (attend: Attendance) => {
                        const isTrue =
                          attend.attachments.filter(
                            (attach) => +attach.attachment_id === +attachment.id
                          ).length > 0;
                        return isTrue;
                      }
                    ).length > 0
                    ? true
                    : false
                  : false,
            })),
          ],
        })),
      ] as Session[];
      // Use the updatedSession with the (attended) value
      // to calc the (locked) value
      set(() => ({
        course: {
          ...data,
          sessions: [
            ...updatedSession.map((session, sIndex) => ({
              ...session,
              attachments: [
                ...session.attachments.map((attachment, aIndex) => ({
                  ...attachment,
                  locked:
                    sIndex === 0
                      ? aIndex === 0
                        ? false
                        : session.attachments[aIndex - 1].attended === true
                        ? false
                        : true
                      : updatedSession[sIndex - 1].attachments.slice(-1).pop()
                          ?.attended === true
                      ? false
                      : true,
                })),
              ],
            })),
          ],
        },
      }));
    } else set(() => ({ course: data }));
  },
  setSession: (sessionId) =>
    set((state: CourseStoreInterface) => ({
      sessionSelected: state.course?.sessions?.filter(
        (session) => session.id === sessionId
      )[0],
    })),

  setAttachment: (sessionId, attachmentId, selectedCourse) => {
    set((state: CourseStoreInterface) => {
      if (
        state.attachmentSelected?.file_type === "mp4" &&
        selectedCourse.sessions
          .filter((session) => session.id === sessionId)[0]
          .attachments.filter((attach) => attach.id === attachmentId)[0]
          .file_type === "mp4"
      ) {
        return {
          ...state,
          attachmentSelected: {
            ...state.attachmentSelected,
            file_type: "none",
          },
        };
      } else return { ...state };
    });
    setTimeout(() => {
      set((state: CourseStoreInterface) => {
        return {
          ...state,
          attachmentSelected: (
            (selectedCourse as Course).sessions.filter(
              (session) => session.id === sessionId
            )[0] as Session
          ).attachments.filter(
            (attach: Attachment) => attach.id === attachmentId
          )[0],
        };
      });
    });
  },
  updateAttendence: (sessionId, attachId) => {
    set((state: CourseStoreInterface) => {
      let unlockAttachId = null as any;
      if (state.course?.sessions)
        return {
          course: {
            ...state.course,
            sessions: [
              ...state.course?.sessions.map((session, sIndex) =>
                session.id === +sessionId
                  ? {
                      ...session,
                      attachments: session.attachments.map(
                        (attachment, aIndex) => {
                          if (attachment.id === +attachId) {
                            // This (if else) statment to check if the attachment is the last one
                            // of the session; to make sure to update (locked) value of the
                            // first attachment in the next session.
                            if (session.attachments.length === aIndex + 1) {
                              if (
                                state.course?.sessions[sIndex + 1] &&
                                state.course?.sessions[sIndex + 1].attachments
                                  .length > 0
                              )
                                state.course.sessions[
                                  sIndex + 1
                                ].attachments[0].locked = false;
                            } else {
                              session.attachments[aIndex + 1].locked = false;
                            }
                            return {
                              ...attachment,
                              attended: true,
                            };
                          } else return attachment;
                        }
                      ),
                    }
                  : session
              ),
            ],
          },
        };
    });
  },
  clearCourseStore: () => set(() => ({ course: undefined })),

  setLastAttachmentId: (res) =>
    set(() => ({
      lastAttachmentId: res.sessions
        .slice(-1)
        .pop()
        ?.attachments.slice(-1)
        .pop()?.id,
    })),

  changeRatingCourseStatus: () =>
    set((state: CourseStoreInterface) => ({
      course: { ...state.course, user_is_rating: true },
    })),

  setAttachmentsArray: (sessions) => {
    const tempArr = sessions.map((session) => {
      return session.attachments.map((attac) => {
        return {
          name: attac.description,
          id: attac.id,
          session_id: attac.session_id,
        };
      });
    });

    set(() => ({ attachmentsArray: tempArr.flat() }));
  },
}));
