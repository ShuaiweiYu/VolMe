import { useState, useEffect } from "react";
import AdminMenu from "./AdminMenu";
import { useNavigate, useParams } from "react-router-dom";
import {
    useUpdateEventMutation,
    useDeleteEventMutation,
    useGetEventByIdQuery,
    useUploadEventImageMutation,
} from "../../redux/events/eventApiSlice";
import { useFetchCategoriesQuery } from "../../redux/events/categoryApiSlice";
import { toast } from "react-toastify";

const AdminEventUpdate = () => {
    const params = useParams();

    const { data: eventData } = useGetEventByIdQuery(params._id);

    console.log(eventData);

    const [title, setTitle] = useState(eventData?.title || "");
    const [date, setDate] = useState(eventData?.date || "");
    const [organiser, setOrganiser] = useState(eventData?.organiser || "");
    const [location, setLocation] = useState(eventData?.location || "");
    const [description, setDescription] = useState(eventData?.description || "");
    const [peopleNeeded, setPeopleNeeded] = useState(eventData?.peopleNeeded || "");
    const [category, setCategory] = useState(eventData?.category || "");
    const [image, setImage] = useState(eventData?.image || "");

    // hook
    const navigate = useNavigate();

    // Fetch categories using RTK Query
    const { data: categories = [] } = useFetchCategoriesQuery();

    const [uploadEventImage] = useUploadEventImageMutation();

    // Define the update product mutation
    const [updateEvent] = useUpdateEventMutation();

    // Define the delete product mutation
    const [deleteEvent] = useDeleteEventMutation();

    useEffect(() => {
        if (eventData && eventData._id) {
            setTitle(eventData.title);
            setDate(eventData.date);
            setOrganiser(eventData.organiser);
            setLocation(eventData.location);
            setDescription(eventData.description);
            setPeopleNeeded(eventData.peopleNeeded);
            setCategory(eventData.category?._id);
            setImage(eventData.image);
        }
    }, [eventData]);

    const uploadFileHandler = async (e) => {
        const formData = new FormData();
        formData.append("image", e.target.files[0]);
        try {
            const res = await uploadEventImage(formData).unwrap();
            toast.success("Image added successfully", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 2000,
            });
            setImage(res.image);
        } catch (err) {
            toast.success("Image added successfully", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 2000,
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("date", date);
            formData.append("organiser", organiser);
            formData.append("location", location);
            formData.append("description", description);
            formData.append("peopleNeeded", peopleNeeded);
            formData.append("category", category);
            formData.append("image", image);

            // Update product using the RTK Query mutation
            const data = await updateEvent({ eventId: params._id, formData });

            if (data?.error) {
                toast.error(data.error, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 2000,
                });
            } else {
                toast.success(`Event successfully updated`, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 2000,
                });
                navigate("/admin/all-events-list");
            }
        } catch (err) {
            console.log(err);
            toast.error("Failed to update this event. Please try again.", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 2000,
            });
        }
    };

    const handleDelete = async () => {
        try {
            let answer = window.confirm(
                "Are you sure you want to delete this event?"
            );
            if (!answer) return;

            const { data } = await deleteEvent(params._id);
            toast.success(`"Event ${data.title}" is deleted`, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 2000,
            });
            navigate("/admin/all-events-list");
        } catch (err) {
            console.log(err);
            toast.error("Failed to delete this event. Please try again.", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 2000,
            });
        }
    };

    return (
        <>
            <div className="container  xl:mx-[9rem] sm:mx-[0]">
                <div className="flex flex-col md:flex-row">
                    <AdminMenu />
                    <div className="md:w-3/4 p-3">
                        <div className="h-12">Update / Delete Event</div>

                        {image && (
                            <div className="text-center">
                                <img
                                    src={image}
                                    alt="event"
                                    className="block mx-auto w-full h-[40%]"
                                />
                            </div>
                        )}

                        <div className="mb-3">
                            <label className="text-white  py-2 px-4 block w-full text-center rounded-lg cursor-pointer font-bold py-11">
                                {image ? image.name : "Upload image"}
                                <input
                                    type="file"
                                    name="image"
                                    accept="image/*"
                                    onChange={uploadFileHandler}
                                    className="text-white"
                                />
                            </label>
                        </div>

                        <div className="p-3">
                            <div className="flex flex-wrap">
                                <div className="one">
                                    <label htmlFor="name">Title</label> <br/>
                                    <input
                                        type="text"
                                        className="p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white mr-[5rem]"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                </div>

                                <div className="two ml-10 ">
                                    <label htmlFor="name block">Organiser</label> <br/>
                                    <input
                                        type="text"
                                        className="p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white"
                                        value={organiser}
                                        onChange={(e) => setOrganiser(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-wrap">
                                <div className="two">
                                    <label htmlFor="name block">Date</label> <br/>
                                    <input
                                        type="number"
                                        className="p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white "
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                    />
                                </div>
                                <div className="two ml-10 ">
                                    <label htmlFor="name block">Location</label> <br/>
                                    <input
                                        type="text"
                                        className="p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                    />
                                </div>
                            </div>

                            <label htmlFor="" className="my-5">
                                Description
                            </label>
                            <textarea
                                type="text"
                                className="p-2 mb-3 bg-[#101011]  border rounded-lg w-[95%] text-white"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />

                            <div className="flex justify-between">
                                <div>
                                    <label htmlFor="name block">People Needed</label> <br />
                                    <input
                                        type="text"
                                        className="p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white "
                                        value={peopleNeeded}
                                        onChange={(e) => setPeopleNeeded(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="">Category</label> <br />
                                    <select
                                        placeholder="Choose Category"
                                        className="p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white mr-[5rem]"
                                        onChange={(e) => setCategory(e.target.value)}
                                    >
                                        {categories?.map((c) => (
                                            <option key={c._id} value={c._id}>
                                                {c.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="">
                                <button
                                    onClick={handleSubmit}
                                    className="py-4 px-10 mt-5 rounded-lg text-lg font-bold  bg-green-600 mr-6"
                                >
                                    Update
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="py-4 px-10 mt-5 rounded-lg text-lg font-bold  bg-pink-600"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminEventUpdate;