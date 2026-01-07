// /* eslint-disable @typescript-eslint/no-explicit-any */

import { baseApi } from "./baseApi";

const FileUpload = baseApi.injectEndpoints({
  endpoints: (build) => ({
    //  get single boat
    uploadFile: build.mutation({
      query: (data) => ({
        url: `/file/upload`,
        method: "POST",
        body: data,
        // RTK Query will automatically detect FormData and not set Content-Type
      }),
      invalidatesTags: ["file"],
    }),
  }),
});

export const { useUploadFileMutation } = FileUpload;
export default FileUpload;
