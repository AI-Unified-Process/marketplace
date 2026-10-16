<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# process.bpmn

The BPMN model `process.bpmn`, wrapped in Markdown so that every skill host installs it.
Use the content of the code block below; a copy written to disk takes the name `process.bpmn`.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" id="Definitions_BP-XXX" targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:collaboration id="Collaboration_BP-XXX">
    <bpmn:participant id="Participant_Organization" name="Organization" processRef="BP-XXX" />
  </bpmn:collaboration>
  <bpmn:process id="BP-XXX" name="Process Name" isExecutable="false">
    <bpmn:documentation>Goal: One sentence on the business outcome the process delivers.
Trigger: The business event that starts the process.
Requirements: FR-XXX, FR-YYY
Status: Draft</bpmn:documentation>
    <bpmn:laneSet id="LaneSet_BP-XXX">
      <bpmn:lane id="Lane_Actor" name="Actor">
        <bpmn:flowNodeRef>StartEvent_Trigger</bpmn:flowNodeRef>
        <bpmn:flowNodeRef>Activity_UseCase</bpmn:flowNodeRef>
        <bpmn:flowNodeRef>EndEvent_Outcome</bpmn:flowNodeRef>
      </bpmn:lane>
    </bpmn:laneSet>
    <bpmn:startEvent id="StartEvent_Trigger" name="Trigger happened" />
    <bpmn:userTask id="Activity_UseCase" name="UC-XXX Use Case Name" />
    <bpmn:endEvent id="EndEvent_Outcome" name="Outcome reached" />
    <bpmn:sequenceFlow id="Flow_1" sourceRef="StartEvent_Trigger" targetRef="Activity_UseCase" />
    <bpmn:sequenceFlow id="Flow_2" sourceRef="Activity_UseCase" targetRef="EndEvent_Outcome" />
  </bpmn:process>
</bpmn:definitions>
```
