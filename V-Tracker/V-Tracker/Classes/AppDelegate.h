/*
 Licensed to the Apache Software Foundation (ASF) under one
 or more contributor license agreements.  See the NOTICE file
 distributed with this work for additional information
 regarding copyright ownership.  The ASF licenses this file
 to you under the Apache License, Version 2.0 (the
 "License"); you may not use this file except in compliance
 with the License.  You may obtain a copy of the License at
 
 http://www.apache.org/licenses/LICENSE-2.0
 
 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an
 "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 KIND, either express or implied.  See the License for the
 specific language governing permissions and limitations
 under the License.
 */

//
//  AppDelegate.h
//  PT Tracker
//
//  Created by Hadi Michael on 19/04/12.
//  Copyright Monash University 2012. All rights reserved.
//

#import <UIKit/UIKit.h>

#import <Cordova/CDVViewController.h>


@interface AppDelegate : NSObject < UIApplicationDelegate > {
	
	/////////////////////////////////////////////////// NON STANDARD CODE - added by Hadi ////////////
	// declare database integration variables
	NSString *databaseName; 
	NSString *databasePath; 
	NSString *databaseFile; 
	NSString *masterName; 
	NSString *masterPath; 
	NSString *masterFile;
	NSString *backupPath;
	NSString *backupFile;
	/////////////////////////////////////////////////// END NON-STANDARD CODE ////////////
	
}

// invoke string is passed to your app on launch, this is only valid if you 
// edit PT-Tracker-Info.plist to add a protocol
// a simple tutorial can be found here : 
// http://iphonedevelopertips.com/cocoa/launching-your-own-application-via-a-custom-url-scheme.html

@property (nonatomic, retain) IBOutlet UIWindow* window;
@property (nonatomic, retain) IBOutlet CDVViewController* viewController;

@end

