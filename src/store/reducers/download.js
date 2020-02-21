import * as actionTypes from '../actions'

import update from 'immutability-helper';

const initialState = {
  searchResults: [],
  videosCurrentlyDownloading: [],
  videosDownloaded: [],
  videoDownloadProgress: []
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.VIDEO_DOWNLOADING: {
      let currentDownloadingVideos = [...state.videosCurrentlyDownloading]
      currentDownloadingVideos.push(action.videoId)
      return {
        ...state,
        videosCurrentlyDownloading: currentDownloadingVideos
      }
    }

    case actionTypes.VIDEO_DOWNLOAD_COMPLETE :{
        let videosDownloaded = [...state.videosDownloaded];
        videosDownloaded.push(action.videoId);
        let currentDownloadingVideos = [...state.videosCurrentlyDownloading];
        let index = currentDownloadingVideos.indexOf(action.videoId);
        currentDownloadingVideos.splice(index, 1);

        return {
            ...state,
            videosCurrentlyDownloading: currentDownloadingVideos,
            videosDownloaded: videosDownloaded
        };
    }
    case actionTypes.VIDEO_DOWNLOAD_PROGRESS:{
        let videoDownloadProgress = [...state.videoDownloadProgress];
        let index = videoDownloadProgress.findIndex(x => x.videoId === action.payload.videoId);

        if(index === -1){
            index = state.videoDownloadProgress.push(action.payload);
            index--;
        }

        return update(state,{
            videoDownloadProgress:{
                [index]: {
                    percentage: {$set: action.payload.percentage}
                 }    
            }
        })
    }
    default:
      return state
  }
}

export default reducer
