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
//  AppDelegate.m
//  PT-Tracker
//
//  Created by Hadi Michael on 19/04/12.
//  Copyright Monash University 2012. All rights reserved.
//

#import "AppDelegate.h"
#import "MainViewController.h"

#ifdef CORDOVA_FRAMEWORK
    #import <Cordova/CDVPlugin.h>
    #import <Cordova/CDVURLProtocol.h>
#else
    #import "CDVPlugin.h"
    #import "CDVURLProtocol.h"
#endif


@implementation AppDelegate

@synthesize window, viewController;

- (id) init
{	
	/** If you need to do any extra app-specific initialization, you can do it here
	 *  -jm
	 **/
    NSHTTPCookieStorage *cookieStorage = [NSHTTPCookieStorage sharedHTTPCookieStorage]; 
    [cookieStorage setCookieAcceptPolicy:NSHTTPCookieAcceptPolicyAlways];
        
    [CDVURLProtocol registerURLProtocol];
    
    return [super init];
}

#pragma UIApplicationDelegate implementation

/**
 * This is main kick off after the app inits, the views and Settings are setup here. (preferred - iOS4 and up)
 */
- (BOOL) application:(UIApplication*)application didFinishLaunchingWithOptions:(NSDictionary*)launchOptions
{   
    NSURL* url = [launchOptions objectForKey:UIApplicationLaunchOptionsURLKey];
    NSString* invokeString = nil;
    
    if (url && [url isKindOfClass:[NSURL class]]) {
        invokeString = [url absoluteString];
		NSLog(@"PT Tracker launchOptions = %@", url);
    }    
    
    CGRect screenBounds = [[UIScreen mainScreen] bounds];
    self.window = [[[UIWindow alloc] initWithFrame:screenBounds] autorelease];
    self.window.autoresizesSubviews = YES;
    
    CGRect viewBounds = [[UIScreen mainScreen] applicationFrame];
    
    self.viewController = [[[MainViewController alloc] init] autorelease];
    self.viewController.useSplashScreen = YES;
    self.viewController.wwwFolderName = @"www";
    self.viewController.startPage = @"index.html";
    self.viewController.invokeString = invokeString;
    self.viewController.view.frame = viewBounds;
    
    // check whether the current orientation is supported: if it is, keep it, rather than forcing a rotation
    BOOL forceStartupRotation = YES;
    UIDeviceOrientation curDevOrientation = [[UIDevice currentDevice] orientation];
    
    if (UIDeviceOrientationUnknown == curDevOrientation) {
        // UIDevice isn't firing orientation notifications yet… go look at the status bar
        curDevOrientation = (UIDeviceOrientation)[[UIApplication sharedApplication] statusBarOrientation];
    }
    
    if (UIDeviceOrientationIsValidInterfaceOrientation(curDevOrientation)) {
        for (NSNumber *orient in self.viewController.supportedOrientations) {
            if ([orient intValue] == curDevOrientation) {
                forceStartupRotation = NO;
                break;
            }
        }
    } 
    
    if (forceStartupRotation) {
        NSLog(@"supportedOrientations: %@", self.viewController.supportedOrientations);
        // The first item in the supportedOrientations array is the start orientation (guaranteed to be at least Portrait)
        UIInterfaceOrientation newOrient = [[self.viewController.supportedOrientations objectAtIndex:0] intValue];
        NSLog(@"AppDelegate forcing status bar to: %d from: %d", newOrient, curDevOrientation);
        [[UIApplication sharedApplication] setStatusBarOrientation:newOrient];
    }
    
    [self.window addSubview:self.viewController.view];
    [self.window makeKeyAndVisible];

    /////////////////////////////////////////////////// NON STANDARD CODE - added by Hadi ////////////
	[UIApplication sharedApplication].idleTimerDisabled = YES; //stop screen from dimming
	
	//Copy over the database if it doesn't exist 
	// Setup some globals 
	databaseName = @"0000000000000001.db"; 
	masterName = @"Databases.db"; 
	
	// Get the path to the Library directory and append the databaseName 
	NSArray *libraryPaths = NSSearchPathForDirectoriesInDomains 
	(NSLibraryDirectory, NSUserDomainMask, YES); 
	NSString *libraryDir = [libraryPaths objectAtIndex:0]; 
	// the directory path for the Databases.db file 
	masterPath = [libraryDir stringByAppendingPathComponent:@"Caches/"]; 
	// the directory path for the 0000000000000001.db file 
	databasePath = [libraryDir stringByAppendingPathComponent:@"Caches/file__0/"]; 
	// the directory+full path for backup files
	backupPath =  [libraryDir stringByAppendingPathComponent:@"../Documents/Backups/websqldbs.appdata.db/"];
	backupFile = [backupPath stringByAppendingPathComponent:databaseName];
	// the full path for the Databases.db file 
	masterFile = [masterPath stringByAppendingPathComponent:masterName]; 
	// the full path for the 0000000000000001.db file 
	databaseFile = [databasePath stringByAppendingPathComponent:databaseName]; 
	// Execute the "checkAndCreateDatabase" function 
	[self checkAndCreateDatabase]; 
	
	/////////////////////////////////////////////////// END NON-STANDARD CODE ////////////
	
    return YES;
}

/////////////////////////////////////////////////// NON STANDARD CODE - added by Hadi ////////////
-(void) checkAndCreateDatabase{ 
	// Check if the SQL database has already been saved to the users phone, if not then copy it over 
	BOOL success; 
	
	// Create a FileManager object, we will use this to check the status 
	// of the database and to copy it over if required 
	NSFileManager *fileManager = [NSFileManager defaultManager]; 
	
	// Check if the database has already been created in the users filesystem 
	success = [fileManager fileExistsAtPath:databasePath]; 
	
	// If the database already exists then return without doing anything 
	if(success) {
		BOOL resetDB = false; //change this BOOL to TRUE if you want to reset the user's databases at launch
		if (resetDB) {
			NSLog ( @"resetDB is set to true.");
			[fileManager removeItemAtPath:backupFile error:nil];
			[fileManager removeItemAtPath:databaseFile error:nil];
			[fileManager removeItemAtPath:masterFile error:nil]; 
		} else {
			NSLog ( @"db-integration was not required!");
			return;
		}
	}
	
	// If not then proceed to copy the database from the application to the users filesystem 
	
	// Get the path to the database in the application package 
	NSString *databasePathFromApp = [[[NSBundle mainBundle] resourcePath] stringByAppendingPathComponent:databaseName]; 
	NSString *masterPathFromApp = [[[NSBundle mainBundle] resourcePath] stringByAppendingPathComponent:masterName]; 
	
	// Create the database folder structure 
	[fileManager createDirectoryAtPath:databasePath withIntermediateDirectories:YES attributes:nil error:NULL]; 
	
	// Copy the database from the package to the users filesystem
	[fileManager copyItemAtPath:databasePathFromApp toPath:databaseFile error:nil]; 
	
	// Copy the Databases.db from the package to the appropriate place 
	[fileManager copyItemAtPath:masterPathFromApp toPath:masterFile error:nil]; 
	
	NSLog ( @"db-initialisation complete. Database were copied accross.");
	
	[fileManager release]; 
} 
/////////////////////////////////////////////////// END NON-STANDARD CODE ////////////

// this happens while we are running ( in the background, or from within our own app )
// only valid if PT-Tracker-Info.plist specifies a protocol to handle
- (BOOL) application:(UIApplication*)application handleOpenURL:(NSURL*)url 
{
    if (!url) { 
        return NO; 
    }
    
	// calls into javascript global function 'handleOpenURL'
    NSString* jsString = [NSString stringWithFormat:@"handleOpenURL(\"%@\");", url];
    [self.viewController.webView stringByEvaluatingJavaScriptFromString:jsString];
    
    // all plugins will get the notification, and their handlers will be called 
    [[NSNotificationCenter defaultCenter] postNotification:[NSNotification notificationWithName:CDVPluginHandleOpenURLNotification object:url]];
    
    return YES;    
}

- (void) dealloc
{
	[super dealloc];
}

/////////////////////////////////////////////////// NON STANDARD CODE - added by Hadi ////////////
// ADD NOTIFICATION CODE
- (void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification 
{
	UIApplicationState state = [application applicationState];
	if (state == UIApplicationStateInactive) {
		// WAS IN BG
		//NSLog(@"I was in the background");
		
		NSString *notCB = [notification.userInfo objectForKey:@"background"];
		NSString * jsCallBack = [NSString stringWithFormat:@"%@", notCB];
		
		[self.viewController.webView stringByEvaluatingJavaScriptFromString:jsCallBack];         
		
		application.applicationIconBadgeNumber = 0;
		
	}
	else {
		// WAS RUNNING
		//NSLog(@"I was currently active");
		
		NSString *notCB = [notification.userInfo objectForKey:@"forground"];
		NSString * jsCallBack = [NSString stringWithFormat:@"%@", notCB];
		
		[self.viewController.webView  stringByEvaluatingJavaScriptFromString:jsCallBack];
		
		application.applicationIconBadgeNumber = 0;
	}                 
}
/////////////////////////////////////////////////// END NON-STANDARD CODE ////////////
@end
