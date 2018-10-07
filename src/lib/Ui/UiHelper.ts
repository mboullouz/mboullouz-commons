export class UiHelper {

    public static nearestByEvent(currentElement: Event, parentSelector: string, targetSelector: string): JQuery<EventTarget> {
        return $((currentElement as any).target).closest(parentSelector).find(targetSelector).first();
    }

    public static nearestBySelector(currentElement: string, parentSelector: string, targetSelector: string): JQuery<Element> {
        return $(currentElement).closest(parentSelector).find(targetSelector).first();
    }
}