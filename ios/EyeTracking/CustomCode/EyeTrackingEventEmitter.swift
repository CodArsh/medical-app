//
//  EyeTrackingEventEmitter.swift
//  oculo
//
//  Created by Krunal Panchal on 10/07/23.
//

import Foundation


@objc(EyeTrackingEventEmitter)
open class EyeTrackingEventEmitter: RCTEventEmitter {

  public static var emitter: RCTEventEmitter!
  @objc public override static func requiresMainQueueSetup() -> Bool { return true }

  override init() {
    super.init()
    EyeTrackingEventEmitter.emitter = self
  }

  open override func supportedEvents() -> [String] {
    ["tracking", "tracking_eye_pos", "onReady", "onPending", "onFailure"]      // etc.
  }
}
