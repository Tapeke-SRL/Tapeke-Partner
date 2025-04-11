#!/bin/bash
. $GITHUB_WORKSPACE/.env
cd ios
xcodebuild \
    -workspace $IOS_PACKAGE_NAME.xcworkspace \
    -scheme $IOS_PACKAGE_NAME \
    clean archive \
    -archivePath "Actions" \
    -configuration "Release"
